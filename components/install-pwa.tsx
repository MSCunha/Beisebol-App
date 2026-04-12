'use client';
import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

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