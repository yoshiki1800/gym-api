'use client';

import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/ui/table';

export function ClickableCustomerRow({ customer, index }: { customer: any, index: number }) {
  const router = useRouter();
  
  // 偶数行（0始まりなのでindex % 2 === 1）に薄いグレーの背景色をつける
  const bgColorClass = index % 2 === 1 ? 'bg-muted/30' : 'bg-background';

  return (
    <TableRow 
      onClick={() => router.push(`/customers/${customer.id}`)}
      className={`cursor-pointer h-16 transition-all active:scale-[0.99] active:bg-muted/50 hover:bg-muted/50 ${bgColorClass}`}
    >
      <TableCell className="font-medium text-muted-foreground">{customer.managementNo}</TableCell>
      <TableCell className="font-medium">{customer.name}</TableCell>
      <TableCell>
        {customer.visitRecords?.[0]?.visitDateTime 
          ? new Date(customer.visitRecords[0].visitDateTime).toLocaleDateString('ja-JP') 
          : '-'}
      </TableCell>
      <TableCell>{customer._count?.visitRecords || 0}回</TableCell>
      <TableCell>{customer.furigana}</TableCell>
      <TableCell>{customer.membershipPlan}</TableCell>
      <TableCell>{customer.phone}</TableCell>
      <TableCell>
        {new Date(customer.joinDate).toLocaleDateString('ja-JP')}
      </TableCell>
    </TableRow>
  );
}
