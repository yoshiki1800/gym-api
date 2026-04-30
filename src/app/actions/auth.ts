'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const pin = formData.get('pin');
  const APP_PIN = process.env.APP_PIN || '1234'; // Default to 1234 if not set

  if (pin === APP_PIN) {
    const cookieStore = await cookies();
    cookieStore.set('gym_auth_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    redirect('/');
  }

  return { success: false, error: 'PINコードが間違っています。' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('gym_auth_token');
  redirect('/login');
}
