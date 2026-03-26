const featureCards = [
  {
    label: "Dashboard",
    value: "KPI + funnel + priority queue",
    tone: "from-cyan-400/14 to-cyan-300/6",
  },
  {
    label: "Routing",
    value: "Owner load snapshot",
    tone: "from-fuchsia-400/14 to-fuchsia-300/6",
  },
  {
    label: "Board",
    value: "Temperature-based follow-up",
    tone: "from-amber-300/14 to-amber-200/6",
  },
];

export function Header() {
  return (
    <header className="glass-panel liquid-highlight relative overflow-hidden rounded-[30px] p-6 lg:p-7">
      <div className="absolute inset-y-0 right-0 hidden w-[32%] bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),_transparent_65%)] lg:block" />

      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/15 bg-fuchsia-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-fuchsia-100">
            <span className="h-2 w-2 rounded-full bg-fuchsia-300 shadow-[0_0_14px_rgba(244,114,182,0.9)]" />
            Vòng 8 • Mini dashboard insights
          </p>
          <h2 className="mt-4 max-w-4xl text-4xl leading-tight text-white sm:text-5xl xl:text-[3.6rem]">
            Mini CRM nhỏ gọn, nhưng đã biết tự kể câu chuyện vận hành bằng dữ liệu.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Hệ thống hiện có dashboard trang chủ, live scoring, routing gợi ý, bộ lọc nhiệt độ lead và detail view để team nhìn nhanh tình trạng pipeline mỗi ngày.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-3 xl:min-w-[560px] xl:max-w-[620px]">
          {featureCards.map((card) => (
            <div
              key={card.label}
              className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${card.tone} p-4 shadow-[0_18px_40px_rgba(2,6,23,0.24)]`}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{card.label}</p>
              <p className="mt-3 text-base font-semibold leading-6 text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
