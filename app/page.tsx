'use client';
import { useState, useEffect } from 'react';
import Loading from '@/components/loading';
import LoginForm from '@/components/loginform';

export default function RootPage() {
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSyncing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <Loading visible={isSyncing} />
      {!isSyncing && (
        <LoginForm onToggleForm={() => window.location.href = '/register'} />
      )}
    </main>
  );
}