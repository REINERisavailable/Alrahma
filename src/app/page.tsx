export const dynamic = 'force-dynamic';

import RequestForm from '@/components/RequestForm';
import { supabase } from '@/lib/supabase';
import { MessageCircle, Music2 } from 'lucide-react';
import Image from 'next/image';

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Header Profile */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-green-600 rounded-full mx-auto mb-4 p-1 shadow-lg shadow-emerald-200">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-2xl text-emerald-600">
            أ
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-800">متجر الرحمة</h1>
        <p className="text-slate-500 mt-2">تسوق أحدث المنتجات واطلب ما تحتاجه بكل سهولة</p>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-2 gap-4 mb-16">
        <a href="https://wa.me/212000000000" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-2xl font-bold transition">
          <MessageCircle className="w-5 h-5" /> واتساب
        </a>
        <a href="https://tiktok.com/@alrahma" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition">
          <Music2 className="w-5 h-5" /> تيك توك
        </a>
      </div>

      {/* Product Request */}
      <div className="mb-16">
        <RequestForm />
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 mb-6 border-b border-slate-200 pb-4">المنتجات المتوفرة</h2>
        
        {products && products.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-50 transition overflow-hidden">
                {p.images && p.images[0] && (
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-slate-50">
                    <img src={p.images[0]} alt={p.title} className="object-cover w-full h-full" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-800 mb-2">{p.title}</h3>
                <div className="prose prose-sm prose-emerald line-clamp-3 text-slate-600" dangerouslySetInnerHTML={{ __html: p.html_description }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/50 rounded-3xl border border-slate-100 border-dashed">
            <p className="text-slate-500">لا توجد منتجات حالياً.</p>
          </div>
        )}
      </div>
      
    </main>
  );
}
