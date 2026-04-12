'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import logoslzbeisebol from "../../public/logoslzbeisebol.png";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    const { error } = await supabase.auth.updateUser({ password });

    if (error) alert("Erro: " + error.message);
    else {
      alert("Senha atualizada com sucesso!");
      window.location.href = "/";
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#5dc0fd]">
      <div className="flex content-center font-sans items-center justify-center w-full p-4">
        <div className="place-items-center justify-center align-middle bg-white rounded-lg p-10 shadow-lg border border-gray-300 w-full max-w-95">
          <Image src={logoslzbeisebol} alt="logo" width={120} height={120} className="mb-4" />
          <h2 className="text-[#5dc0fd] font-black italic uppercase text-lg mb-6">Nova Senha</h2>
          
          <form onSubmit={handleUpdatePassword} className="w-full flex flex-col items-center">
            <input 
              className="w-full text-black text-center border border-gray-300 rounded-md m-2 p-1.5 focus:ring-1 focus:ring-[#5dc0fd] outline-none" 
              type="password" placeholder="Digite a nova senha" 
              onChange={(e) => setPassword(e.target.value)} required 
            />
            <button type="submit" className="text-white w-full bg-[#5dc0fd] shadow-md rounded-full mt-4 p-2 font-bold hover:brightness-95 transition-all">
              ATUALIZAR SENHA
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}