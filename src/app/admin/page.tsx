export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import { PackageOpen, Check, X } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const { data: requests, error } = await supabase
    .from('product_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-red-500">حدث خطأ في جلب البيانات: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <PackageOpen className="w-6 h-6 text-slate-800" />
        طلبات المنتجات
      </h1>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-right divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">المنتج المقترح (AI)</th>
              <th className="px-6 py-4 font-semibold text-slate-700">التصنيف</th>
              <th className="px-6 py-4 font-semibold text-slate-700">رابط المصدر</th>
              <th className="px-6 py-4 font-semibold text-slate-700">الحالة</th>
              <th className="px-6 py-4 font-semibold text-slate-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">لا توجد طلبات جديدة.</td>
              </tr>
            )}
            {requests?.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-800">{req.suggested_data?.title || 'غير معروف'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-600">
                    {req.suggested_data?.category || 'عام'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {req.user_link ? (
                    <a href={req.user_link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                      عرض المصدر
                    </a>
                  ) : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    req.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    req.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {req.status === 'pending' ? 'قيد المراجعة' : req.status === 'approved' ? 'مقبول' : 'مرفوض'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Link href={`/admin/request/${req.id}`} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition">
                    مراجعة وتعديل
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
