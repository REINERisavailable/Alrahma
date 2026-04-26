'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const password = formData.get('password');
  
  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin_auth', 'true', { secure: true, maxAge: 60 * 60 * 24 * 7 });
    redirect('/admin');
  } else {
    return { error: 'كلمة المرور غير صحيحة' };
  }
}
