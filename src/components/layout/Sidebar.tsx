"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, PlusCircle } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", match: "exact" as const, Icon: LayoutDashboard },
  { href: "/leads/new", label: "Thêm Lead", match: "exact" as const, Icon: PlusCircle },
  { href: "/leads", label: "Danh sách Lead", match: "segment" as const, Icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="shrink-0 border-b border-slate-200 bg-white text-slate-600 lg:flex lg:h-full lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center border-b border-slate-200 px-4 sm:px-6 lg:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-600 shadow-sm" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-900">MindX Mini CRM</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden py-3 lg:overflow-y-auto lg:py-6">
        <nav className="flex min-w-max gap-2 px-4 lg:min-w-0 lg:flex-col lg:space-y-1 lg:gap-0">
          <p className="hidden px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-slate-500 lg:block">Điều hướng</p>
          {navItems.map((item) => {
            const isActive = item.match === "exact"
              ? pathname === item.href
              : pathname === item.href ||
                (pathname.startsWith(`${item.href}/`) && pathname !== "/leads/new");
            const Icon = item.Icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-red-50 text-red-700 font-bold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={20} className={isActive ? "text-red-600" : "text-slate-400 group-hover:text-slate-600"} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* Footer Info */}
      <div className="m-4 hidden rounded-xl border-t border-slate-200 bg-slate-50 p-4 lg:block">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Tình trạng hệ thống</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Trạng thái</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Hoạt động ổn định
          </span>
        </div>
      </div>
    </aside>
  );
}
