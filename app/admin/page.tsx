'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminManager() {
  const [athletes, setAthletes] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAthletes();
  }, []);

  async function fetchAthletes() {
    const { data } = await supabase!.from('profiles').select('*').eq('status', 'approved');
    setAthletes(data || []);
  }

  async function updateAthleteStats(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase!.from('profiles').update({
      strength: selected.strength,
      speed: selected.speed,
      agility: selected.agility,
      reaction: selected.reaction,
      coaching_notes: selected.coaching_notes,
      history_notes: selected.history_notes
    }).eq('id', selected.id);
    
    if (!error) {
      alert("Ficha do Atleta atualizada!");
      fetchAthletes();
      setSelected(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#5dc0fd] p-8 font-sans">
      <div className="max-w-6xl mx-auto flex gap-6">
        {/* Lista de Atletas */}
        <div className="w-1/3 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-2 mb-6 text-[#5dc0fd]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <h2 className="font-black italic uppercase">Elenco</h2>
          </div>
          <div className="space-y-2">
            {athletes.map(a => (
              <button key={a.id} onClick={() => setSelected(a)} className={`w-full text-left p-3 rounded-lg font-bold text-xs uppercase ${selected?.id === a.id ? 'bg-[#5dc0fd] text-white' : 'bg-gray-50 text-slate-400 hover:bg-gray-100'}`}>
                #{a.jersey_number} - {a.full_name}
              </button>
            ))}
          </div>
        </div>

        {/* Formulário de Notas e Feedback */}
        {selected && (
          <form onSubmit={updateAthleteStats} className="flex-1 bg-white rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-slate-800 font-black italic uppercase text-xl mb-6">Editor de Atleta: {selected.full_name}</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatInput label="Força" val={selected.strength} set={(v) => setSelected({...selected, strength: v})} />
              <StatInput label="Velocidade" val={selected.speed} set={(v) => setSelected({...selected, speed: v})} />
              <StatInput label="Agilidade" val={selected.agility} set={(v) => setSelected({...selected, agility: v})} />
              <StatInput label="Reação" val={selected.reaction} set={(v) => setSelected({...selected, reaction: v})} />
            </div>
            <textarea className="w-full border p-3 rounded-md mb-4 h-24 text-xs" placeholder="Histórico de Evolução..." value={selected.history_notes} onChange={e => setSelected({...selected, history_notes: e.target.value})} />
            <textarea className="w-full border p-3 rounded-md mb-4 h-24 text-xs" placeholder="Feedback Técnico (Análise do Coach)..." value={selected.coaching_notes} onChange={e => setSelected({...selected, coaching_notes: e.target.value})} />
            <button type="submit" className="w-full bg-[#5dc0fd] text-white font-black p-3 rounded-full shadow-lg uppercase italic">Salvar Alterações</button>
          </form>
        )}
      </div>
    </main>
  );
}

function StatInput({ label, val, set }: { label: string, val: number, set: (v: number) => void }) {
  return (
    <div>
      <label className="text-[10px] font-black text-gray-400 uppercase">{label} (0-100)</label>
      <input type="number" value={val} onChange={e => set(parseInt(e.target.value))} className="w-full border rounded p-2 font-bold text-slate-700" />
    </div>
  );
}