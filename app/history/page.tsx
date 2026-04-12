"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import AdminModal from "@/components/admin-modal"; 

type Tab = "evolucao" | "feedbacks" | "jogos";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("evolucao");
  const [history, setHistory] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        setProfile(profileData);

        const { data: historyData } = await supabase
          .from("stats_history")
          .select("*")
          .eq("athlete_id", user.id)
          .order("created_at", { ascending: true });

        setHistory(historyData || []);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <Loading visible={true} />;

  // Mapeamento dos 12 atributos para o gráfico
  const chartData = history.map((h) => ({
    data: new Date(h.created_at).toLocaleDateString("pt-BR"),
    Overall: h.overall,
    Frequência: h.frequencia,
    Agilidade: h.agilidade,
    Flexibilidade: h.flexibilidade,
    Força: h.forca,
    Resistência: h.resistencia,
    Velocidade: h.velocidade,
    Arremesso: h.arremesso,
    Defesa: h.defesa,
    Visão: h.visao,
    Precisão: h.precisao,
    Rebatida: h.rebatida,
    Contato: h.contato,
  }));

  return (
    <main className="min-h-screen bg-[#5dc0fd] flex font-sans relative overflow-hidden">
      <Sidebar
        isAdmin={profile?.is_admin || false}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <div className="flex-1 p-4 md:p-10 ml-14 flex flex-col items-center">
        <header className="w-full max-w-5xl mb-6 text-white animate-in slide-in-from-top duration-700">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
            Histórico de Performance
          </h1>
          <p className="text-[10px] font-bold opacity-70 uppercase tracking-[0.3em] mt-1">
            Unidade de Inteligência Itapiracó
          </p>
        </header>

        {/* ESTRUTURA DE FICHÁRIO */}
        <div className="w-full max-w-5xl flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-500">
          <div className="flex gap-1 items-end px-4">
            <TabHandle
              active={activeTab === "evolucao"}
              onClick={() => setActiveTab("evolucao")}
              label="Evolução"
            />
            <TabHandle
              active={activeTab === "feedbacks"}
              onClick={() => setActiveTab("feedbacks")}
              label="Feedbacks"
            />
            <TabHandle
              active={activeTab === "jogos"}
              onClick={() => setActiveTab("jogos")}
              label="Notas de Jogo"
            />
          </div>

          <div className="bg-white rounded-lg shadow-2xl p-6 md:p-12 flex-1 min-h-150 relative">
            {activeTab === "evolucao" && (
              <div className="space-y-12">
                <section>
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h2 className="text-slate-800 font-black italic uppercase text-sm flex items-center gap-2">
                        <div className="w-2 h-5 bg-[#5dc0fd] rounded-full" />
                        Historico de Evolução
                      </h2>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase italic">
                      Escala 0-100
                    </span>
                  </div>

                  <div className="h-112.5 w-full bg-slate-50/50 rounded-md p-6 border border-slate-100 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="data"
                          fontSize={9}
                          fontWeight="900"
                          stroke="#cbd5e1"
                          tickMargin={10}
                        />
                        <YAxis
                          fontSize={9}
                          fontWeight="900"
                          stroke="#cbd5e1"
                          domain={[0, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "20px",
                            border: "none",
                            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                            padding: "15px",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{
                            paddingTop: "30px",
                            fontSize: "9px",
                            fontWeight: "900",
                            textTransform: "uppercase",
                          }}
                        />

                        <Line
                          type="monotone"
                          dataKey="Overall"
                          stroke="#0f172a"
                          strokeWidth={5}
                          dot={{ r: 6, fill: "#0f172a" }}
                          activeDot={{ r: 8 }}
                        />

                        <Line
                          type="monotone"
                          dataKey="Velocidade"
                          stroke="#5dc0fd"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Força"
                          stroke="#f97316"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Arremesso"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Defesa"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Agilidade"
                          stroke="#ec4899"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Flexibilidade"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Resistência"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Visão"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Precisão"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Rebatida"
                          stroke="#475569"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Contato"
                          stroke="#a855f7"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Frequência"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <MiniStat
                    label="Performance Atual"
                    value={history[history.length - 1]?.overall || 0}
                  />
                  <MiniStat
                    label="Saldo de Evolução"
                    value={`${history[history.length - 1]?.overall - history[0]?.overall >= 0 ? "+" : ""}${history[history.length - 1]?.overall - history[0]?.overall || 0}%`}
                    isPositive={
                      history[history.length - 1]?.overall -
                        history[0]?.overall >=
                      0
                    }
                  />
                  <MiniStat
                    label="Maior Pico"
                    value={Math.max(...history.map((h) => h.overall), 0)}
                  />
                  <MiniStat label="Registros" value={history.length} />
                </div>
              </div>
            )}

            {activeTab === "feedbacks" && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-slate-800 font-black italic uppercase text-sm mb-6 flex items-center gap-2">
                  <div className="w-2 h-5 bg-[#5dc0fd] rounded-full" />
                  Prontuário de Avaliações
                </h2>
                <div className="grid gap-6">
                  {history
                    .filter((h) => h.notas_tecnicas)
                    .reverse()
                    .map((h, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 border-l-12 border-[#5dc0fd] p-8 rounded-r-4xl relative group hover:bg-slate-100 transition-colors"
                      >
                        <span className="absolute top-6 right-8 text-[10px] font-black text-slate-300 italic uppercase tracking-widest">
                          {new Date(h.created_at).toLocaleDateString("pt-BR")}
                        </span>
                        <p className="text-slate-600 text-sm font-bold leading-relaxed italic pr-24">
                          "{h.notas_tecnicas}"
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </main>
  );
}

function TabHandle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 rounded-t-3xl text-[10px] font-black uppercase italic tracking-tighter transition-all duration-500 ${active ? "bg-white text-slate-800 shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)] h-14" : "bg-white/20 text-white/50 h-11 hover:bg-white/40"}`}
    >
      {label}
    </button>
  );
}

function MiniStat({
  label,
  value,
  isPositive,
}: {
  label: string;
  value: any;
  isPositive?: boolean;
}) {
  return (
    <div className="bg-slate-50 p-6 rounded-4xl border border-slate-100 shadow-sm">
      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-2 tracking-widest">
        {label}
      </p>
      <p
        className={`text-3xl font-black italic tracking-tighter ${isPositive ? "text-[#10b981]" : "text-slate-800"}`}
      >
        {value}
      </p>
    </div>
  );
}
