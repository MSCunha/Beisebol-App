'use client';
import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detecta se é iOS
    const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isApple);

    if (typeof window === 'undefined') return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Se for iPhone, mostramos uma dica em vez de um botão de comando
  if (isIOS) {
    return (
      <div className="fixed bottom-6 right-6 z-100 bg-white p-4 rounded-2xl shadow-2xl border-2 border-[#5dc0fd] text-[10px] font-bold uppercase italic text-slate-800 max-w-50">
        Para instalar no iPhone: <br />
        <span className="text-[#5dc0fd]">1. Toque no ícone de compartilhar ⎋</span> <br />
        <span className="text-[#5dc0fd]">2. 'Adicionar à Tela de Início'</span>
      </div>
    );
  }

  if (!deferredPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-100">
      <button
        onClick={() => deferredPrompt.prompt()}
        className="bg-white text-[#5dc0fd] px-5 py-3 rounded-full shadow-2xl border-2 border-[#5dc0fd] font-black italic text-xs uppercase"
      >
        📲 Instalar App
      </button>
    </div>
  );
}