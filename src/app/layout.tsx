import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { LeadProvider } from "@/contexts/LeadContext";
import "./globals.css";

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MindX Mini CRM | Lead cockpit demo",
  description:
    "Mini CRM quản lý lead với dashboard premium, live scoring, routing preview và trải nghiệm giao diện hiện đại dành cho MindX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <LeadProvider>
          <div className="relative min-h-screen overflow-hidden text-white">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[-10%] top-[-5%] h-[26rem] w-[26rem] rounded-full bg-cyan-400/12 blur-3xl" />
              <div className="absolute right-[-8%] top-[10%] h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/12 blur-3xl" />
              <div className="absolute bottom-[-8%] left-[28%] h-[22rem] w-[22rem] rounded-full bg-sky-400/10 blur-3xl" />
            </div>

            <div className="relative mx-auto grid min-h-screen max-w-[1620px] gap-5 px-4 py-4 lg:grid-cols-[330px_1fr] lg:px-6 lg:py-6">
              <Sidebar />
              <main className="space-y-5">
                <Header />
                <div className="glass-panel rounded-[34px] p-4 sm:p-6 lg:p-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </LeadProvider>
      </body>
    </html>
  );
}
