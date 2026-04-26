'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, UploadCloud, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RequestForm() {
  const [link, setLink] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSuggest = async () => {
    if (!link && files.length === 0) return alert('أدخل رابط أو ارفع صورة');
    setLoading(true);

    try {
      let targetLink = link;

      // Handle file upload first if file is provided
      if (files.length > 0) {
        // Just take the first image for the SerpAPI visual search
        const file = files[0];
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}.${ext}`;
        const { data, error } = await supabase.storage
          .from('products')
          .upload(`requests/${fileName}`, file);

        if (error) throw error;
        const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(data.path);
        targetLink = publicUrlData.publicUrl;
      }

      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: targetLink, isImage: files.length > 0 && !link }),
      });
      const aiData = await res.json();
      if (aiData.error) throw new Error(aiData.error);
      setSuggestion({ ...aiData, source_link: targetLink });
    } catch (err: any) {
      alert('خطأ: ' + err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('product_requests').insert({
        user_link: suggestion?.source_link || link,
        suggested_data: suggestion,
        status: 'pending'
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      alert('خطأ في الإرسال: ' + err.message);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center bg-white rounded-3xl shadow-xl shadow-green-100/50">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-800">تم إرسال طلبك بنجاح!</h3>
        <p className="text-slate-500 mt-2">سنقوم بمراجعة المنتج وتوفيره في أقرب وقت.</p>
        <button onClick={() => { setSubmitted(false); setSuggestion(null); setLink(''); setFiles([]); }} className="mt-6 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition">طلب منتج آخر</button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-green-100 border border-white/40">
      <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
        طلب منتج جديد <span className="text-emerald-500 text-sm font-medium px-3 py-1 bg-emerald-100 rounded-full">مدعوم بالذكاء الاصطناعي</span>
      </h2>
      
      {!suggestion ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">رابط المنتج (اختياري إذا رفعت صورة)</label>
            <div className="relative">
              <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                value={link} 
                onChange={e => setLink(e.target.value)}
                placeholder="https://example.com/product"
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
              />
            </div>
          </div>

          <div className="relative border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-3xl p-8 text-center hover:bg-emerald-50 transition cursor-pointer group">
            <input 
              type="file" 
              multiple
              accept="image/*"
              onChange={e => setFiles(Array.from(e.target.files || []))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-10 h-10 text-emerald-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-emerald-800 font-medium">ارفع صور المنتج أو اسحبها هنا</p>
            <p className="text-sm text-emerald-600 mt-1">{files.length > 0 ? \`تم اختيار \${files.length} صور\` : '(اختياري إذا أدخلت رابط)'}</p>
          </div>

          <button 
            onClick={handleSuggest} 
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex justify-center items-center gap-2 transition disabled:opacity-70 shadow-lg shadow-emerald-200"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تحليل وتجهيز الطلب'}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-lg text-slate-800 mb-2">{suggestion.title}</h4>
            <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-500 mb-4">{suggestion.category}</span>
            <div className="prose prose-sm prose-emerald" dangerouslySetInnerHTML={{ __html: suggestion.html_description }} />
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex justify-center items-center gap-2 transition disabled:opacity-70 shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تأكيد الإرسال للإدارة'}
            </button>
            <button 
              onClick={() => setSuggestion(null)} 
              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition"
            >
              إلغاء
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
