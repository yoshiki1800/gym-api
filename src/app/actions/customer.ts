'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCustomers(searchQuery?: string) {
  try {
    let dateFilter = undefined;
    
    // Check if query looks like a date (e.g. 2024-05-01 or 2024/05/01)
    if (searchQuery && /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(searchQuery)) {
      const date = new Date(searchQuery.replace(/\//g, '-'));
      if (!isNaN(date.getTime())) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        dateFilter = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }
    }

    const customers = await prisma.customer.findMany({
      where: searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery } },
              { furigana: { contains: searchQuery } },
              { email: { contains: searchQuery } },
              { phone: { contains: searchQuery } },
              { managementNo: { contains: searchQuery } },
              ...(dateFilter
                ? [
                    { joinDate: dateFilter },
                    { visitRecords: { some: { visitDateTime: dateFilter } } },
                  ]
                : []),
            ],
          }
        : undefined,
      include: {
        _count: {
          select: { visitRecords: true },
        },
        visitRecords: {
          orderBy: { visitDateTime: 'desc' },
          take: 1,
          select: { visitDateTime: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

// Fetch a single customer
export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        visitRecords: {
          orderBy: {
            visitDateTime: 'desc',
          },
        },
      },
    });
    return customer;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

// Create a new customer
export async function createCustomer(formData: FormData) {
  const name = formData.get('name') as string;
  const furigana = formData.get('furigana') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const membershipPlan = formData.get('membershipPlan') as string;
  const initialGoals = formData.get('initialGoals') as string;
  const notes = formData.get('notes') as string;

  try {
    // Generate management number
    const lastCustomer = await prisma.customer.findFirst({
      orderBy: { managementNo: 'desc' },
      select: { managementNo: true },
    });

    let nextNum = 1;
    if (lastCustomer?.managementNo?.startsWith('C-')) {
      const numPart = parseInt(lastCustomer.managementNo.replace('C-', ''), 10);
      if (!isNaN(numPart)) {
        nextNum = numPart + 1;
      }
    }
    const managementNo = `C-${String(nextNum).padStart(5, '0')}`;

    const newCustomer = await prisma.customer.create({
      data: {
        managementNo,
        name,
        furigana,
        phone,
        email,
        membershipPlan,
        initialGoals,
        notes,
      },
    });
    
    revalidatePath('/');
    return { success: true, customer: newCustomer };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { success: false, error: 'Failed to create customer' };
  }
}

// Add a visit record
export async function addVisitRecord(customerId: string, formData: FormData) {
  const staff = formData.get('staff') as string;
  const trainingDetails = formData.get('trainingDetails') as string;
  const bodyMetrics = formData.get('bodyMetrics') as string;
  const condition = formData.get('condition') as string;
  const nextSteps = formData.get('nextSteps') as string;
  const visitDateTimeStr = formData.get('visitDateTime') as string;

  try {
    const newRecord = await prisma.visitRecord.create({
      data: {
        customerId,
        staff,
        trainingDetails,
        bodyMetrics,
        condition,
        nextSteps,
        ...(visitDateTimeStr ? { visitDateTime: new Date(visitDateTimeStr) } : {}),
      },
    });

    revalidatePath(`/customers/${customerId}`);
    return { success: true, record: newRecord };
  } catch (error) {
    console.error('Error adding visit record:', error);
    return { success: false, error: 'Failed to add visit record' };
  }
}
