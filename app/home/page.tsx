"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Loading from "@/components/loading";
import StatsCard from "@/components/stats-card";
import Sidebar from "@/components/sidebar";
import AdminModal from "@/components/admin-modal";

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*, player_stats(*)") 
          .eq("id", user.id)
          .single();

        setProfile(data);
      }
      setLoading(false);
    }
    checkStatus();
  }, []);

  if (loading) return <Loading visible={true} />;

  // TELA DE AGUARDANDO APROVAÇÃO
  if (profile?.status === "pending") {
    return (
      <main className="h-screen bg-[#3278a3] flex flex-col items-center justify-center p-10 text-center">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-500 border-4 border-white">
          <h1 className="text-2xl font-black italic uppercase text-slate-800">
            Cadastro Recebido!
          </h1>
          <p className="text-slate-500 text-sm mt-4 font-bold max-w-xs">
            Fala, {profile.full_name}! Sua solicitação está com a diretoria do
            SLZ Beisebol no Itapiracó. Você será notificado assim que seu card
            for liberado.
          </p>
          <button
            onClick={() =>
              supabase!.auth.signOut().then(() => (window.location.href = "/"))
            }
            className="mt-8 bg-slate-800 text-white px-10 py-4 rounded-full font-black italic uppercase text-[10px] hover:bg-red-600 transition-all shadow-lg active:scale-95"
          >
            Sair e Aguardar
          </button>
        </div>
      </main>
    );
  }

  // DASHBOARD DO ATLETA
  return (
    <main className="min-h-screen bg-[#3278a3] flex items-center justify-center relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isAdmin={profile?.is_admin}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* O Card Centralizado com efeito Holo */}
      <div className="z-10 animate-in fade-in zoom-in duration-1000">
        <StatsCard profile={profile} />
      </div>

      {/* MODAL DE ADMINISTRAÇÃO */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Efeito visual de profundidade no fundo */}
      <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-white/20 rounded-r-full blur-sm" />
    </main>
  );
}
