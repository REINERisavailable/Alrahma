import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-slate-900 text-white p-4 font-bold text-xl shadow-md">
        لوحة تحكم الإدارة - متجر الرحمة
      </header>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}
