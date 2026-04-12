"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import AdminModal from "@/components/admin-modal";

export default function TutorialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
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

      const { data: tutorialsData } = await supabase
        .from("tutorials")
        .select("*")
        .order("created_at", { ascending: false });

      setItems(tutorialsData || []);
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

      <div className="flex-1 p-8 ml-16 overflow-y-auto h-screen">
        <header className="mb-10 max-w-6xl mx-auto">
          <h1 className="text-white font-black italic uppercase text-4xl tracking-tighter">
            Centro de Treinamento
          </h1>
          <p className="text-white/70 font-bold uppercase text-xs mt-2 tracking-widest">
            Vídeos, Artigos e Manuais Técnicos
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto pb-20">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border-4 border-white"
            >
              {/* CONTAINER DO VÍDEO CORRIGIDO */}
              {item.type === "video" && (
                <div className="relative w-full aspect-video bg-black shadow-inner overflow-hidden">
                  <div
                    /* Esta classe força o iframe interno a ser responsivo */
                    className="absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-none"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#5dc0fd] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase italic">
                    {item.type}
                  </span>
                </div>

                <h3 className="text-slate-800 font-black italic uppercase text-xl mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm mb-6 flex-1 italic font-medium">
                  {item.description}
                </p>

                {/* AÇÕES DE DOWNLOAD / LEITURA */}
                {item.type === "pdf" && (
                  <a
                    href={item.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-800 text-white p-4 rounded-2xl font-black italic text-center uppercase text-xs hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar Cartilha PDF
                  </a>
                )}

                {item.type === "article" && (
                  <a
                    href={item.content}
                    target="_blank"
                    className="w-full border-2 border-[#5dc0fd] text-[#5dc0fd] p-4 rounded-2xl font-black italic text-center uppercase text-xs hover:bg-[#5dc0fd] hover:text-white transition-all shadow-md"
                  >
                    Ler Artigo Completo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </main>
  );
}