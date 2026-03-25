import Link from "next/link";

const pillars = [
  {
    title: "Nhập lead nhanh",
    description: "Form rõ ràng, validation đủ chặt, sẵn sàng nối localStorage ở vòng sau.",
  },
  {
    title: "Quan sát pipeline",
    description: "Dashboard shell đã sẵn để gắn table, filter, scoring và routing logic.",
  },
  {
    title: "Học từ cấu trúc thật",
    description: "App Router, component tách nhỏ, types riêng — đúng tinh thần dự án dạy học có thể mở rộng.",
  },
];

export default function Home() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[30px] border border-white/10 bg-slate-950/50 p-7">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-200/80">Overview</p>
        <h3 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-white sm:text-5xl">
          Một Mini CRM đủ đẹp để demo, đủ sạch để tiếp tục phát triển.
        </h3>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
          Vòng 1 tập trung dựng khung trải nghiệm: layout chính, route tạo lead và cảm giác sản phẩm premium ngay khi mở app.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link id="go-to-new-lead" href="/leads/new" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200">
            Đi tới form thêm lead
          </Link>
          <span className="rounded-full border border-white/12 px-6 py-3 text-sm text-slate-300">
            Roadmap: localStorage → table → detail/edit → scoring/routing
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Pillar</p>
            <h4 className="mt-3 text-2xl font-semibold text-white">{pillar.title}</h4>
            <p className="mt-3 text-sm leading-7 text-slate-300">{pillar.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
