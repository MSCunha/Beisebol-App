"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import AdminModal from "@/components/admin-modal";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        setProfile(profileData);
      }

      const { data: newsData } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      setNews(newsData || []);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <Loading visible={true} />;

  return (
    <main className="min-h-screen bg-[#5dc0fd] flex font-sans relative overflow-hidden">
      <Sidebar
        isAdmin={profile?.is_admin || false}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <div className="flex-1 p-8 ml-16 overflow-y-auto h-screen animate-in fade-in duration-700">
        <div className="max-w-6xl mx-auto pb-20">
          <header className="mb-12 border-b-4 border-white/20 pb-4">
            <h1 className="text-white font-black italic uppercase text-4xl tracking-tighter leading-none">
              Boletins do Bullpen
            </h1>
            <p className="text-white/60 font-bold uppercase text-[10px] mt-2 tracking-[0.3em]">
              Informativo Oficial SLZ Beisebol
            </p>
          </header>

          {/* GRID DE NOTÍCIAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="bg-white rounded-4xl shadow-2xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-all border-b-8 border-slate-800 group relative overflow-hidden flex flex-col"
              >
                {/* Imagem de Capa */}
                {item.image_url ? (
                  <div className="h-48 w-full overflow-hidden relative">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-60" />
                  </div>
                ) : (
                  <div className="h-1.5 bg-[#5dc0fd] w-12 mt-8 ml-8 group-hover:w-[80%] transition-all duration-500 rounded-full" />
                )}

                <div className="p-8 flex flex-col flex-1">
                  <span className="text-[9px] font-black text-[#5dc0fd] uppercase tracking-widest mb-2">
                    {new Date(item.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  
                  <h3 className="text-slate-800 font-black italic uppercase text-xl leading-tight mb-4 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 text-xs font-bold leading-relaxed line-clamp-3 italic mb-6">
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-center text-slate-800 text-[10px] font-black uppercase italic gap-2 group-hover:gap-4 transition-all">
                    <span>Ler Boletim</span>
                    <svg className="w-4 h-4 text-[#5dc0fd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ESTADO VAZIO */}
          {!loading && news.length === 0 && (
            <div className="text-center py-32 bg-white/5 rounded-[40px] border-4 border-dashed border-white/10 flex flex-col items-center">
              <p className="text-white/40 font-black italic uppercase tracking-widest text-sm">
                Nenhum boletim emitido.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DA NOTÍCIA EXPANDIDA */}
      {selectedNews && (
        <div className="fixed inset-0 z-200 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            
            {/* Header da Notícia com Imagem Grande */}
            <div className="relative h-64 md:h-80 w-full bg-slate-900">
              {selectedNews.image_url ? (
                <img src={selectedNews.image_url} className="w-full h-full object-cover opacity-80" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#5dc0fd]/10">
                   <img src="/logoslzbeisebol.png" className="w-20 opacity-20 grayscale" alt="" />
                </div>
              )}
              
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-red-500 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full bg-linear-to-t from-white via-white/80 to-transparent">
                 <span className="text-[#5dc0fd] font-black text-xs uppercase tracking-[0.3em]">
                   {new Date(selectedNews.created_at).toLocaleDateString("pt-BR")}
                 </span>
                 <h2 className="text-slate-900 font-black italic uppercase text-3xl md:text-4xl leading-none mt-2">
                   {selectedNews.title}
                 </h2>
              </div>
            </div>

            <div className="px-8 md:px-12 pb-12 overflow-y-auto">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 font-bold text-lg leading-relaxed whitespace-pre-wrap italic border-l-4 border-[#5dc0fd] pl-6 py-2">
                  {selectedNews.description}
                </p>
                <div className="mt-8 text-slate-800 font-medium text-base leading-relaxed whitespace-pre-wrap">
                  {selectedNews.content}
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
                 <button 
                  onClick={() => setSelectedNews(null)}
                  className="bg-slate-800 text-white px-10 py-4 rounded-2xl font-black italic uppercase text-xs hover:bg-[#5dc0fd] transition-all"
                 >
                   Fechar Boletim
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </main>
  );
}