"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

// Interface obrigatória para o TypeScript aceitar a prop do pai
interface LoginFormProps {
  onToggleForm: () => void;
}

export default function LoginForm({ onToggleForm }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert("Erro: " + error.message);
    else window.location.href = "/home";
  };

  return (
    <div className="flex content-center font-sans min-h-screen items-center bg-[#5dc0fd] justify-center w-full p-4">
      <div className="flex flex-col place-items-center justify-center align-middle items-center bg-white rounded-lg p-10 shadow-lg shadow-gray-600/50 border border-gray-300 w-full max-w-100">
        <Image
          src="/logoslzbeisebol.png"
          alt="logo"
          width={120}
          height={120}
          priority
          className="mb-4"
        />

        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center w-full"
        >
          <input
            className="w-full text-black text-center border border-gray-300 rounded-md m-3 p-1.5 focus:ring-1 focus:ring-[#5dc0fd]"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full text-black text-center border border-gray-300 rounded-md m-3 p-1.5 focus:ring-1 focus:ring-[#5dc0fd]"
            type="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="text-white text-md w-1/2 bg-[#5dc0fd] shadow-md shadow-gray-700/40 rounded-lg m-3 p-2 font-bold cursor-pointer hover:brightness-95 transition-all"
          >
            LOGIN
          </button>
        </form>

        <button
          onClick={onToggleForm}
          className="text-white text-md w-1/2 bg-[#5dc0fd] shadow-md shadow-gray-700/40 rounded-lg m-1 p-2 text-sm font-bold cursor-pointer hover:brightness-95 transition-all"
        >
          REGISTRAR
        </button>

        <button
          onClick={() => (window.location.href = "/forgot-password")}
          className="text-sm text-[#5dc0fd] mt-4 font-bold hover:underline cursor-pointer"
        >
          Recuperar Senha
        </button>
      </div>
    </div>
  );
}
