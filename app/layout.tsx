import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="flex min-h-screen">
        <ThemeProvider>
          <Sidebar />
          <div className="app-shell flex-1 ml-64 flex flex-col min-h-screen">
            <Header />
            <main className="app-main flex-1 pt-20 px-8 pb-12 overflow-y-auto max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
