"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSensor } from "@/context/SensorContext";

interface SidebarProps {
  isAdmin: boolean;
  onOpenAdmin: () => void; 
}

export default function Sidebar({ isAdmin, onOpenAdmin }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isEnabled, setIsEnabled, permissionStatus, requestPermission } = useSensor();

  return (
    <>

    {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-90 animate-in fade-in duration-300"
        />
      )}

      {/* CHEVRON */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-55 bg-white w-6 h-12 rounded-r-full shadow-lg flex items-center justify-center cursor-pointer border-y border-r border-slate-200"
        >
          <svg
            className="w-4 h-4 text-[#5dc0fd]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}

      {/* MENU LATERAL */}
      <aside
        onMouseLeave={() => setIsOpen(false)}
        className={`fixed left-0 top-0 h-full bg-white shadow-[10px_0_30px_rgba(0,0,0,0.1)] z-100 transition-transform duration-500 ease-in-out flex flex-col py-10
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}`}
      >
        <div className="flex-1 flex flex-col gap-2 px-4">
          {/* Logo e Nome do Time */}
          <div className="flex items-center gap-2 mb-8 px-4">
            <Image
              src="/logoslzbeisebol.png"
              alt="logo"
              width={30}
              height={30}
              priority
            />
            <h2 className="text-slate-800 font-black italic uppercase text-sm tracking-tighter">
              São Luis Beisebol
            </h2>
          </div>

          {/* Links de Navegação */}
          <SidebarItem
            label="Home"
            onClick={() => router.push("/home")}
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            }
          />

          <SidebarItem
            label="Novidades"
            onClick={() => router.push("/news")}
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
              />
            }
          />

          <SidebarItem
            label="Tutoriais"
            onClick={() => router.push("/tutorials")}
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
              />
            }
          />

          <SidebarItem
            label="Histórico"
            onClick={() => router.push("/history")}
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
              />
            }
          />

          {/* PAINEL ADMIN */}
          {isAdmin && (
            <SidebarItem
              label="Painel Admin"
              onClick={onOpenAdmin}
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                />
              }
            />
          )}
        </div>

        {/* Sensor de Gyroscópio */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Inclinação Física</span>
            </div>
            <button 
              onClick={() => setIsEnabled(!isEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${isEnabled ? 'bg-[#5dc0fd] shadow-[0_0_10px_#5dc0fd]' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Botão de Logout */}
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="mx-8 p-4 text-slate-400 font-black uppercase italic text-[10px] hover:text-red-500 transition-colors border-t border-slate-100 cursor-pointer"
        >
          Sair do Campo
        </button>
      </aside>
    </>
  );
}

function SidebarItem({
  icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-5 w-full px-8 py-4 cursor-pointer hover:bg-slate-50 group transition-all"
    >
      <svg
        className="w-6 h-6 text-[#5dc0fd] group-hover:scale-110 transition-transform"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        {icon}
      </svg>
      <span className="font-black text-slate-600 text-xs uppercase italic tracking-tighter group-hover:text-[#5dc0fd]">
        {label}
      </span>
    </div>
  );
}
