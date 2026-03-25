import Link from "next/link";

const navItems = [
  { href: "/", label: "Tổng quan", badge: "MVP" },
  { href: "/leads/new", label: "Thêm Lead", badge: "Hot" },
  { href: "/leads", label: "Danh sách Lead", badge: "Soon" },
];

export function Sidebar() {
  return (
    <aside className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-cyan-400/20 via-fuchsia-500/20 to-amber-300/20 blur-2xl" />
      <div className="relative space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">MindX Mini CRM</p>
          <div>
            <h1 className="font-serif text-3xl text-white">Lead cockpit</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Không chỉ nhập lead. Đây là buồng điều phối lead với trải nghiệm gọn, đậm và dễ dạy.
            </p>
          </div>
        </div>

        <nav aria-label="Main navigation" className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-slate-900/70"
            >
              <span>{item.label}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-cyan-200">
                {item.badge}
              </span>
            </Link>
          ))}
        </nav>

        <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Design anchor</p>
          <p className="mt-2 leading-6">
            Giao diện chọn hướng <strong>neo-futurist editorial</strong>: tối, nhiều glow, typography sang nhưng vẫn đủ rõ cho người mới học.
          </p>
        </div>
      </div>
    </aside>
  );
}
