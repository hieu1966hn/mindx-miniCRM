import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { LeadProvider } from "@/contexts/LeadContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
