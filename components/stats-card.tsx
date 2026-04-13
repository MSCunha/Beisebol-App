"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export default function StatsCard({ profile }: { profile: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [images, setImages] = useState({
    front: null as string | null,
    bg: null as string | null,
  });

  useEffect(() => {
    if (profile?.full_name && supabase) {
      const slug = profile.full_name.toLowerCase().replace(/\s+/g, "");
      const bgUrl = supabase.storage
        .from("cards")
        .getPublicUrl(`${slug}_bg.webp`).data.publicUrl;
      const frontUrl = supabase.storage
        .from("cards")
        .getPublicUrl(`${slug}_front.webp`).data.publicUrl;
      setImages({ bg: bgUrl, front: frontUrl });
    }
  }, [profile]);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    const py = Math.min(Math.max((y / rect.height) * 100, 0), 100);

    const rxVal = -((py - 50) / 2.5);
    const ryVal = (px - 50) / 2.5;

    const p_from_left = px / 100;
    const p_from_top = py / 100;
    const p_from_center =
      Math.sqrt(
        Math.pow(p_from_left - 0.5, 2) + Math.pow(p_from_top - 0.5, 2),
      ) * 2;

    setStyle({
      "--mx": `${px}%`,
      "--my": `${py}%`,
      "--posx": `${px}%`,
      "--posy": `${py}%`,
      "--pointer-from-center": p_from_center,
      "--rx": rxVal,
      "--ry": ryVal,
      "--o": 1,
      "--hyp": Math.sqrt(Math.pow(py - 50, 2) + Math.pow(px - 50, 2)) / 50,
    });
  }, []);

  const [style, setStyle] = useState<any>({
    "--mx": "50%",
    "--my": "50%",
    "--posx": "50%",
    "--posy": "50%",
    "--rx": 0,
    "--ry": 0,
    "--o": 1,
    "--hyp": 0,
  });

  const stats = Array.isArray(profile?.player_stats)
    ? profile.player_stats[0]
    : profile?.player_stats || {};

  const radarPhysical = [
    { label: "FOR", value: stats.forca || 0 },
    { label: "RES", value: stats.resistencia || 0 },
    { label: "VEL", value: stats.velocidade || 0 },
    { label: "FLEX", value: stats.flexibilidade || 0 },
    { label: "AGI", value: stats.agilidade || 0 },
  ];

  const radarFull = [
    { label: "FREQ", value: stats.frequencia || 0 },
    { label: "AGI", value: stats.agilidade || 0 },
    { label: "FLEX", value: stats.flexibilidade || 0 },
    { label: "FOR", value: stats.forca || 0 },
    { label: "RES", value: stats.resistencia || 0 },
    { label: "VEL", value: stats.velocidade || 0 },
    { label: "ARR", value: stats.arremesso || 0 },
    { label: "DEF", value: stats.defesa || 0 },
    { label: "VIS", value: stats.visao || 0 },
    { label: "PREC", value: stats.precisao || 0 },
    { label: "REB", value: stats.rebatida || 0 },
    { label: "CONT", value: stats.contato || 0 },
  ];

  return (
    <div
      className={`perspective-midrange w-96 aspect-63/88 relative cursor-pointer ${isFlipped ? "is-flipped" : ""}`}
      onMouseMove={handleMove}
      onMouseLeave={() =>
        setStyle((s: any) => ({
          ...s,
          "--rx": 0,
          "--ry": 0,
          "--o": 1,
          "--pointer-from-center": 0,
        }))
      }
      onClick={() => setIsFlipped(!isFlipped)}
      data-rarity="rare ultra"
      data-subtypes="supporter"
    >
      <div
        ref={cardRef}
        style={style}
        className="w-full h-full relative transition-transform duration-500 preserve-3d card__rotator rounded-md"
      >
        {/* 1. FRONT FACE (LADO A) */}
        <div className="absolute inset-0 backface-hidden rounded-md overflow-hidden card__front">
          <div className="card__grain z-50 pointer-events-none" />
          <div className="card__glare z-40" />
          <div className="card__glitter z-15" />
          <div className="card__foil z-45" />

          <div className="absolute inset-0 z-10 pointer-events-none bg-radial bg-radial-to-r/hsl from-indigo-500 from-25% to-teal-400 card-frame-style rounded-md overflow-hidden" />

          <div className="absolute inset-5 z-20 rounded-t-md overflow-hidden bg-slate-900 h-6/8 ">
            {images.bg && (
              <img
                src={images.bg}
                className="w-full h-full object-cover"
                alt="Background"
                onError={(e) => (e.currentTarget.src = "/img/trainerbg.png")}
              />
            )}
            <div className="card__foil-background" />
          </div>

          <div className="absolute inset-3 z-30 transform translate-z-5 pointer-events-none w-9/10 h-9/10">
            {images.front && (
              <img
                src={images.front}
                className="w-full h-full object-contain"
                alt="Character"
              />
            )}
          </div>

          <div className="absolute inset-0 top-7 z-40 flex flex-col justify-between p-4 text-white pointer-events-none">
            <div className="flex justify-between items-start drop-shadow-xl">
              <div className="bg-linear-to-r from-gray-400 via-gray-100 to-gray-400 h-7 ml-1 mr-20 pl-10 text-black">
                <h2 className="font-black italic uppercase text-2xl leading-none">
                  {profile?.jersey_name || "PLAYER"}
                </h2>
                <p className="flex justify-between items-center bg-linear-to-r from-slate-900 from-40% to-slate-600 text-white border-b-2 border-gray-300 font-bold text-xl w-72 h-7 -ml-10 pl-10 pr-15 tracking-widest">
                  <span>#{profile?.jersey_number || "00"}</span>
                  <span className="uppercase">{profile?.position_tag || "POS"}</span>
                </p>
              </div>
              <div className="w-20 h-20 z-50 bg-slate-900 rounded-full border-3 border-gray-300 absolute right-4 -top-3 flex items-center justify-center font-black text-4xl shadow-xl">
                {stats.overall || 0}
              </div>
            </div>

            <div className="h-[22%] bg-linear-to-r from-gray-400 via-gray-100 to-gray-400 rounded-b-lg p-3 border border-white/10 m-1 pointer-events-auto flex flex-col justify-center">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <div className="-mt-10 shrink-0 rounded-full bg-radial from-gray-200 from-40% to-gray-400">
                    <RadarChart stats={radarPhysical} size={90} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 flex-1 text-black italic">
                    <StatItem label="FOR" val={stats.forca} />
                    <StatItem label="VEL" val={stats.velocidade} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-black italic mt-1">
                  <StatItem label="FLEX" val={stats.flexibilidade} />
                  <StatItem label="RES" val={stats.resistencia} />
                  <StatItem label="AGI" val={stats.agilidade} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. BACK FACE */}
        <div className="absolute inset-0 backface-hidden rounded-md overflow-hidden card__back bg-slate-900 border-none">
          <div className="card__grain z-50 pointer-events-none" />
          <div className="card__glare z-40" />
          <div className="card__foil z-45" />
          {/* LOGO */}
          <div className="absolute top-6 right-6 z-40 w-12 h-12 pointer-events-none">
            <img
              src="/logoslzbeisebol.png"
              alt="Logo São Luís Beisebol"
              className="w-full h-full object-contain opacity-80 filter drop-shadow-md brightness-110"
              onError={(e) => {
                console.error("Erro ao carregar a logo. Verifique se o arquivo está em /public/logoslzbeisebol.png");
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
  
          {/* BORDA */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-radial from-indigo-500 from-25% to-teal-400 card-frame-style rounded-md overflow-hidden" />
          <div className="card__glitter z-15 opacity-20" />

          {/* STATS */}
          <div className="absolute inset-5 z-20 rounded-md overflow-hidden bg-repeat bg-linear-to-r from-gray-400 via-gray-100 to-gray-400 h-[92%] flex flex-col items-center p-2 text-slate-900 shadow-inner">
            <h3 className="text-center font-black italic uppercase tracking-tighter text-slate-800 text-sm self-center justify-center">
              {profile?.jersey_name || "PLAYER"} • #{profile?.jersey_number || "00"}
            </h3>
            {/* RADAR CHART*/}
            <div className="flex-1 w-full flex items-center justify-center p-1 mb-2 relative overflow-visible bg-transparent ">
              
              <div className="absolute inset-0 opacity-10 pointer-events-none" />
              
              <RadarChart stats={radarFull} size={200} />
            </div>

            {/* Grade de Atributos */}
            <div className="w-full bg-slate-800/10 rounded-lg p-2 border border-black/5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div className="flex flex-col gap-1.5">
                  <StatItem label="VEL" val={stats.velocidade} />
                  <StatItem label="FOR" val={stats.forca} />
                  <StatItem label="DEF" val={stats.defesa} />
                  <StatItem label="REB" val={stats.rebatida} />
                  <StatItem label="CON" val={stats.contato} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <StatItem label="ARR" val={stats.arremesso} />
                  <StatItem label="AGI" val={stats.agilidade} />
                  <StatItem label="PREC" val={stats.precisao} />
                  <StatItem label="VIS" val={stats.visao} />
                  <StatItem label="FREQ" val={stats.frequencia} />
                </div>
              </div>
            </div>

            {/* Rodapé do Verso */}
            <div className="mt-2 w-full flex justify-between items-center px-1 opacity-50 font-black italic text-[7px] uppercase tracking-widest">
              <span>São Luís Beisebol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, val }: { label: string; val: number }) {
  const percentage = Math.min(Math.max(val || 0, 0), 100);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-end px-0.5">
        <span className="opacity-70 text-md leading-none font-black">{label}</span>
        <span className="text-md leading-none font-black">{val || 0}</span>
      </div>
      <div className="h-2.5 w-full bg-black/25 rounded-full overflow-hidden border border-black/5 p-px mt-0.5">
        <div 
          className="h-full rounded-full transition-all duration-700 ease-out bg-linear-to-t from-indigo-500 via-indigo-200 to-indigo-500 shadow-[0_0_5px_rgba(255,255,255,0.2)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function RadarChart({
  stats,
  size,
}: {
  stats: { label: string; value: number }[];
  size: number;
}) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) * 0.72;
  const angleStep = (Math.PI * 2) / stats.length;

  const points = stats
    .map((stat, i) => {
      const r = (Math.min(Math.max(stat.value, 5), 100) / 100) * radius;
      return `${centerX + r * Math.sin(i * angleStep)},${centerY - r * Math.cos(i * angleStep)}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {[0.5, 1].map((m) => (
        <circle
          key={m}
          cx={centerX}
          cy={centerY}
          r={radius * m}
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1"
        />
      ))}
      <polygon
        points={points}
        fill="rgba(6, 182, 212, 0.5)"
        stroke="#0891b2"
        strokeWidth="2"
      />
      {stats.map((stat, i) => (
        <text
          key={i}
          x={centerX + (radius + 12) * Math.sin(i * angleStep)}
          y={centerY - (radius + 12) * Math.cos(i * angleStep)}
          fill="#000"
          fontSize="12"
          stroke="#fff"
          strokeWidth="0.4"
          fontWeight="1000"
          textAnchor="middle"
          alignmentBaseline="middle"
          className="italic opacity-70 uppercase"
        >
          {stat.label}
        </text>
      ))}
    </svg>
  );
}