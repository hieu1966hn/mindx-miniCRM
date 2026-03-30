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
      <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 font-sans lg:h-screen lg:flex-row lg:overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </LeadProvider>
  );
}
