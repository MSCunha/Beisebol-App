'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function NotificationHandler() {
  useEffect(() => {
    // Verificação de segurança inicial para evitar erros de 'null'
    if (!supabase) return;

    const requestPermission = async () => {
      if (!("Notification" in window)) return;
      
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    };

    requestPermission();

    // Início da escuta em tempo real
    const channel = supabase
      .channel('news-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'news' },
        (payload) => {
          const newNews = payload.new;
          
          if (Notification.permission === "granted") {
            new Notification(`📢 ${newNews.title}`, {
              body: newNews.description,
              icon: "/logoslzbeisebol.png",
            });
          }
        }
      )
      .subscribe();

    return () => {
      // Verificação de segurança também na função de limpeza
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return null;
}