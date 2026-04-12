import type { Metadata } from "next";
import "./globals.css";
import InstallPWA from "@/components/install-pwa";
import NotificationHandler from "@/components/notification-handler";

export const metadata: Metadata = {
  title: "SLZ Beisebol",
  description: "App oficial do São Luís Beisebol",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SLZ Beisebol",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="h-full antialiased">
      <body className="min-h-screen bg-[#5dc0fd] flex flex-col m-0 p-0">
        {/* Gerenciador de notificações e PWA */}
        <NotificationHandler />
        <InstallPWA /> 
        
        {children}
      </body>
    </html>
  );
}