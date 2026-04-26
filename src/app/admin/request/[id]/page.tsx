import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function RequestReviewPage({ params }: { params: { id: string } }) {
  const { data: req } = await supabase.from('product_requests').select('*').eq('id', params.id).single();

  if (!req) return <div>الطلب غير موجود</div>;

  async function approveRequest(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const html_description = formData.get('html_description') as string;
    const user_link = formData.get('user_link') as string;

    const { error: prodError } = await supabase.from('products').insert({
      title,
      html_description,
      images: [user_link], // simple approach for demo
    });

    if (prodError) {
      console.error(prodError);
      return;
    }

    await supabase.from('product_requests').update({ status: 'approved' }).eq('id', req.id);
    redirect('/admin');
  }

  async function rejectRequest() {
    'use server';
    await supabase.from('product_requests').update({ status: 'rejected' }).eq('id', req.id);
    redirect('/admin');
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">مراجعة الطلب</h2>
      
      <form action={approveRequest} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">عنوان المنتج</label>
          <input 
            type="text" 
            name="title" 
            defaultValue={req.suggested_data?.title} 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">وصف المنتج (HTML المولد عبر الذكاء الاصطناعي)</label>
          <textarea 
            name="html_description" 
            defaultValue={req.suggested_data?.html_description} 
            rows={10} 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            dir="ltr"
          />
        </div>

        <div>
           <label className="block text-sm font-semibold text-slate-700 mb-2">الرابط / الصورة المرفوعة</label>
           {req.user_link ? (
             req.user_link.match(/\\.(jpeg|jpg|gif|png)$/i) || req.user_link.includes('supabase') ? (
               <img src={req.user_link} alt="صورة المنتج" className="h-64 object-cover rounded-xl" />
             ) : (
               <a href={req.user_link} target="_blank" rel="noreferrer" className="text-blue-500 underline">{req.user_link}</a>
             )
           ) : 'لا يوجد'}
           <input type="hidden" name="user_link" value={req.user_link || ''} />
        </div>

        <div className="flex gap-4 pt-6 mt-6 border-t border-slate-100">
          <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex-1">
            موافقة وإضافة كمنتج
          </button>
          <button formAction={rejectRequest} className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition flex-1">
            رفض الطلب
          </button>
        </div>
      </form>
    </div>
  );
}
