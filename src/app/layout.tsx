import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { LeadProvider } from "@/contexts/LeadContext";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MindX Mini CRM",
  description: "Mini CRM quản lý lead đầu vào với trải nghiệm dashboard premium, form nhập liệu mượt và kiến trúc dễ mở rộng.",
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
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.20),_transparent_26%),radial-gradient(circle_at_85%_15%,_rgba(232,121,249,0.16),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#050b1b_48%,_#020617_100%)] text-white">
            <div className="mx-auto grid min-h-screen max-w-[1600px] gap-5 px-4 py-4 lg:grid-cols-[320px_1fr] lg:px-6 lg:py-6">
              <Sidebar />
              <main className="space-y-5">
                <Header />
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:p-6 lg:p-8">
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
