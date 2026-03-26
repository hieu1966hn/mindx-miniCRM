"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
      <path
        d="M4.75 5.75h6.5v5.5h-6.5zm8 0h6.5v8h-6.5zm-8 7h6.5v5.5h-6.5zm8 3h6.5v2.5h-6.5z"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AddLeadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
      <path
        d="M12 5.5v13m6.5-6.5h-13"
        className="stroke-current"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="8.5" className="stroke-current" strokeWidth="1.5" />
    </svg>
  );
}

function LeadListIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
      <path
        d="M8 7h10M8 12h10M8 17h10"
        className="stroke-current"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="5" cy="7" r="1" className="fill-current" />
      <circle cx="5" cy="12" r="1" className="fill-current" />
      <circle cx="5" cy="17" r="1" className="fill-current" />
    </svg>
  );
}

const navItems = [
  { href: "/", label: "Dashboard", badge: "Live", match: "exact" as const, Icon: DashboardIcon },
  { href: "/leads/new", label: "Thêm Lead", badge: "Hot", match: "exact" as const, Icon: AddLeadIcon },
  { href: "/leads", label: "Danh sách Lead", badge: "Flow", match: "segment" as const, Icon: LeadListIcon },
];

const pulseItems = [
  { label: "Response SLA", value: "< 15 phút" },
  { label: "Routing mode", value: "Auto-priority" },
  { label: "Pipeline focus", value: "Hot + Warm" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel liquid-highlight relative overflow-hidden rounded-[30px] p-5 lg:p-6">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-cyan-400/22 via-fuchsia-500/18 to-amber-300/18 blur-2xl" />
      <div className="relative space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
            MindX Mini CRM
          </div>

          <div>
            <h1 className="text-3xl text-white">Lead cockpit</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Một giao diện đủ sang để demo, đủ rõ để dạy học và đủ giống sản phẩm thật để kể câu chuyện CRM hiện đại.
            </p>
          </div>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-slate-950/55 p-4 shadow-[0_20px_40px_rgba(2,6,23,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Command center</p>
              <p className="mt-2 text-lg font-semibold text-white">Admissions pulse</p>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Stable
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {pulseItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-3 py-3"
              >
                <span className="text-sm text-slate-300">{item.label}</span>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <nav aria-label="Main navigation" className="space-y-3">
          {navItems.map((item) => {
            const isActive =
              item.match === "exact"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.Icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "group relative flex items-center justify-between overflow-hidden rounded-[22px] border px-4 py-4 text-sm transition duration-300",
                  isActive
                    ? "border-cyan-300/40 bg-cyan-300/14 shadow-[0_18px_32px_rgba(34,211,238,0.16)]"
                    : "border-white/8 bg-white/[0.04] text-slate-200 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:shadow-[0_18px_32px_rgba(34,211,238,0.12)]",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className={[
                    "absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full transition-all duration-300",
                    isActive
                      ? "bg-cyan-300 shadow-[0_0_22px_rgba(103,232,249,0.95)]"
                      : "bg-transparent group-hover:bg-cyan-300/45",
                  ].join(" ")}
                />

                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "flex h-11 w-11 items-center justify-center rounded-2xl border transition duration-300",
                      isActive
                        ? "border-cyan-200/20 bg-cyan-200/12 text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                        : "border-white/10 bg-slate-950/50 text-cyan-200 group-hover:border-cyan-300/25 group-hover:bg-cyan-300/10 group-hover:text-cyan-50",
                    ].join(" ")}
                  >
                    <Icon />
                  </span>

                  <div>
                    <span
                      className={[
                        "block font-medium transition",
                        isActive ? "text-cyan-100" : "text-white group-hover:text-cyan-100",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>
                    <span
                      className={[
                        "mt-1 block text-xs",
                        isActive ? "text-cyan-100/75" : "text-slate-400",
                      ].join(" ")}
                    >
                      {isActive ? "Bạn đang ở khu vực này" : "Điều hướng đến khu vực liên quan"}
                    </span>
                  </div>
                </div>

                <span
                  className={[
                    "rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]",
                    isActive
                      ? "border border-cyan-200/25 bg-cyan-200/15 text-cyan-50"
                      : "border border-white/10 bg-slate-950/60 text-cyan-200",
                  ].join(" ")}
                >
                  {item.badge}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-[26px] border border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-400/12 via-white/4 to-cyan-300/10 p-4 text-sm text-slate-100">
          <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-100/75">Design anchor</p>
          <p className="mt-3 leading-7 text-slate-200">
            Hướng visual là <strong>liquid-glass dashboard</strong>: có chiều sâu, có ánh sáng, có nhịp chuyển động nhẹ và cảm giác tool nội bộ cao cấp.
          </p>
        </div>
      </div>
    </aside>
  );
}
