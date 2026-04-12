'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import logoslzbeisebol from "../../public/logoslzbeisebol.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) alert("Erro: " + error.message);
    else setSent(true);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#5dc0fd]">
      <div className="flex content-center font-sans items-center justify-center w-full p-4">
        <div className="place-items-center justify-center align-middle bg-white rounded-lg p-10 shadow-lg shadow-gray-600/50 border border-gray-300 w-full max-w-95 text-center">
          
          <Image src={logoslzbeisebol} alt="logo" width={120} height={120} className="mb-4" priority />
          
          {!sent ? (
            <>
              <h2 className="text-[#5dc0fd] font-black italic uppercase text-lg mb-2">Recuperar Acesso</h2>
              <p className="text-gray-500 text-xs mb-6 font-bold uppercase tracking-tight">Insira seu e-mail para receber o link de redefinição.</p>
              
              <form onSubmit={handleResetRequest} className="w-full flex flex-col items-center">
                <input 
                  className="w-full text-black text-center border border-gray-300 rounded-md m-2 p-1.5 focus:outline-none focus:ring-1 focus:ring-[#5dc0fd]" 
                  type="email" placeholder="Seu e-mail cadastrado" 
                  onChange={(e) => setEmail(e.target.value)} required 
                />

                <button type="submit" className="flex text-center justify-center text-white w-full bg-[#5dc0fd] shadow-md rounded-full mt-4 p-2 font-bold hover:brightness-95 transition-all">
                  ENVIAR LINK
                </button>
                
                <button type="button" onClick={() => window.location.href = '/'} className="text-sm font-bold text-gray-400 mt-4 uppercase tracking-widest hover:text-[#5dc0fd]">
                  Voltar
                </button>
              </form>
            </>
          ) : (
            <div className="py-4">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-[#5dc0fd] font-black italic uppercase text-lg mb-2">E-mail Enviado!</h2>
              <p className="text-gray-600 text-sm font-bold">Verifique sua caixa de entrada e siga as instruções para criar sua nova senha.</p>
              <button onClick={() => window.location.href = '/'} className="text-[#5dc0fd] font-black uppercase text-xs mt-6 underline">Voltar ao Login</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}