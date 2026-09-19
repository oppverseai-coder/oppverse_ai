import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AppShell from "@/components/AppShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavProvider } from "@/components/NavProvider";

export const metadata: Metadata = {
  title: "Oppverse.ai — Your AI Opportunity Intelligence Platform",
  description: "One profile. A universe of personalized jobs, fellowships, scholarships, grants, and speaking opportunities that find you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('oppverse-theme');var h=document.documentElement;h.classList.remove('light','dark');h.classList.add(t==='light'?'light':'dark');h.style.colorScheme=t==='light'?'light':'dark'}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="flex min-h-screen">
        <ThemeProvider>
          <NavProvider>
            <Sidebar />
            <AppShell>{children}</AppShell>
          </NavProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
