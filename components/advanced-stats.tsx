'use client';
import { useState } from 'react';

export default function AdvancedStats({ profile, close }: { profile: any, close: () => void }) {
  const [activeTab, setActiveTab] = useState<'evolucao' | 'feedback'>('evolucao');

  return (
    <div className="fixed inset-0 z-200 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Container "Ficha" */}
      <div className="bg-[#fdfdfd] w-full max-w-2xl rounded-tr-3xl rounded-b-xl shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Abas Estilo Ficha */}
        <div className="flex gap-1 bg-transparent p-0 mt-2 ml-4">
          <Tab active={activeTab === 'evolucao'} onClick={() => setActiveTab('evolucao')} label="Evolução" />
          <Tab active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} label="Feedbacks" />
          <button onClick={close} className="ml-auto mr-4 text-slate-400 hover:text-red-500 font-bold">FECHAR</button>
        </div>

        {/* Conteúdo da Ficha */}
        <div className="flex-1 p-8 bg-white border-t-2 border-slate-200">
          <div className="mb-6 flex justify-between items-end border-b pb-4">
            <div>
              <h2 className="text-2xl font-black italic text-slate-800 uppercase">{profile.full_name}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase">Registro Oficial de Atleta • Itapiracó</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black italic text-[#5dc0fd]">#{profile.jersey_number}</span>
            </div>
          </div>

          {activeTab === 'evolucao' ? (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300">
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  Histórico de Evolução Técnica
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                  {profile.history_notes || "Nenhum histórico registrado até o momento."}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg overflow-hidden border">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Data</th>
                    <th className="p-4">Análise do Treinador</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 font-medium">
                  <tr className="border-t">
                    <td className="p-4 whitespace-nowrap">03/04/2026</td>
                    <td className="p-4 italic leading-tight">{profile.coaching_notes}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Tab({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-8 py-3 rounded-t-xl text-[10px] font-black uppercase transition-all ${active ? 'bg-white text-slate-800 shadow-[-2px_-2px_5px_rgba(0,0,0,0.05)] border-t-2 border-x-2 border-slate-200' : 'bg-slate-100 text-slate-400'}`}
    >
      {label}
    </button>
  );
}