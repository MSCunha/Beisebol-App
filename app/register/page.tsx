"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import logoslzbeisebol from "../../public/logoslzbeisebol.png";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: "",
    nomeNaCamisa: "",
    numero: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (formData.password !== formData.confirmPassword) {
      return alert("As senhas não coincidem!");
    }

    // Criação do usuário com metadados de solicitação
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.nome,
          jersey_name: formData.nomeNaCamisa,
          jersey_number: parseInt(formData.numero),
          status: "pending",
        },
      },
    });

    if (error) alert("Erro: " + error.message);
    else {
      alert("Solicitação enviada! Um administrador irá avaliar seu perfil.");
      window.location.href = "/";
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#5dc0fd]">
      <div className="flex content-center font-sans items-center justify-center w-full p-4">
        <div className="place-items-center justify-center align-middle bg-white rounded-lg p-10 shadow-lg shadow-gray-600/50 border border-gray-300 w-1/5 max-w-1/5">
          <Image
            src={logoslzbeisebol}
            alt="slzbeisebol logo"
            width={120}
            height={120}
            priority
            className="mb-4"
          />

          <h2 className="text-[#5dc0fd] font-black italic uppercase text-lg mb-4">
            Pedir Registro
          </h2>

          <form
            onSubmit={handleRequest}
            className="w-full flex flex-col items-center"
          >
            <input
              className="w-full text-black text-center border border-gray-300 rounded-md m-2 p-1.5 focus:outline-none focus:ring-1 focus:ring-[#5dc0fd] placeholder-gray-400"
              type="text"
              placeholder="Nome Completo"
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              required
            />

            <input
              className="w-full text-black text-center border border-gray-300 rounded-md m-2 p-1.5 focus:outline-none focus:ring-1 focus:ring-[#5dc0fd] placeholder-gray-400"
              type="number"
              placeholder="# Número Camisa"
              min="1"
              max="99"
              onChange={(e) =>
                setFormData({ ...formData, numero: e.target.value })
              }
              required
            />

            <input
              className="w-full text-black text-center border border-gray-300 rounded-md m-2 p-1.5 focus:outline-none focus:ring-1 focus:ring-[#5dc0fd] placeholder-gray-400"
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <input
              className="w-full text-black text-center border border-gray-300 rounded-md m-2 p-1.5 focus:outline-none focus:ring-1 focus:ring-[#5dc0fd] placeholder-gray-400"
              type="password"
              placeholder="Senha"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <input
              className="w-full text-black text-center border border-gray-300 rounded-md m-2 p-1.5 focus:outline-none focus:ring-1 focus:ring-[#5dc0fd] placeholder-gray-400"
              type="password"
              placeholder="Confirmar Senha"
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />

            <button
              type="submit"
              className="flex text-center justify-center text-white w-full bg-[#5dc0fd] shadow-md shadow-gray-600/50 rounded-lg m-3 mt-6 p-2 font-bold hover:bg-[#5dc0fd]/90 focus:outline-none focus:ring-1 focus:ring-[#5dc0fd] cursor-pointer transition-all"
            >
              SOLICITAR ACESSO
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="text-sm font-bold text-[#5dc0fd] mt-2 hover:underline cursor-pointer"
            >
              VOLTAR AO LOGIN
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
