'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase!.auth.getUser();
      const { data } = await supabase!.from('profiles').select('is_admin').eq('id', user?.id).single();
      if (!data?.is_admin) return router.push('/home');
      fetchPendingRequests();
    }
    checkAdmin();
  }, [router]);

  async function fetchPendingRequests() {
    const { data } = await supabase!.from('profiles').select('*').eq('status', 'pending');
    setRequests(data || []);
  }

  async function updateStatus(id: string, newStatus: 'approved' | 'rejected') {
    const { error } = await supabase!.from('profiles').update({ status: newStatus }).eq('id', id);
    if (!error) fetchPendingRequests();
  }

  return (
    <main className="min-h-screen bg-[#5dc0fd] p-6 font-sans flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white font-black italic uppercase text-2xl">Pendentes</h1>
          <button onClick={() => router.push('/home')} className="text-white text-xs font-bold underline">VOLTAR</button>
        </div>
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-xl p-5 shadow-lg border-l-8 border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-black text-[#5dc0fd] italic uppercase leading-tight">{req.full_name}</p>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-tighter">CAMISA # {req.jersey_number}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(req.id, 'approved')} className="bg-green-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase cursor-pointer hover:bg-green-600">Aceitar</button>
                <button onClick={() => updateStatus(req.id, 'rejected')} className="bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase cursor-pointer hover:bg-red-600">Recusar</button>
              </div>
            </div>
          ))}
          {requests.length === 0 && <p className="text-white/60 text-center italic font-bold">Nenhum pedido novo.</p>}
        </div>
      </div>
    </main>
  );
}