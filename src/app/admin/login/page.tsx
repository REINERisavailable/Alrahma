'use client';

import { login } from './action';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    if (res?.error) setError(res.error);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">دخول الإدارة</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">كلمة المرور</label>
          <input 
            type="password" 
            name="password"
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition"
            placeholder="أدخل كلمة المرور"
          />
        </div>
        <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">
          دخول
        </button>
      </form>
    </div>
  );
}
