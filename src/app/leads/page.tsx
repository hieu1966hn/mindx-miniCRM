import Link from "next/link";
import type { Metadata } from "next";

const plannedFeatures = [
  "Bảng lead với filter theo status / nguồn / campus",
  "Lưu localStorage để dữ liệu không mất khi refresh",
  "Trang detail/edit cho từng lead",
  "Lead scoring và auto-routing cơ bản",
];

export const metadata: Metadata = {
  title: "Danh sách Lead | MindX Mini CRM",
  description: "Trang roadmap cho danh sách lead, chuẩn bị cho các vòng phát triển tiếp theo của Mini CRM.",
};

export default function LeadsPage() {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[30px] border border-white/10 bg-slate-950/50 p-7">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Leads board</p>
        <h3 className="mt-3 font-serif text-4xl text-white">Danh sách lead sẽ ở đây trong Vòng 2.</h3>
        <p className="mt-5 text-base leading-8 text-slate-300">
          Tôi đã dựng sẵn route này để navigation hoàn chỉnh ngay từ đầu. Ở vòng kế tiếp, phần này sẽ nhận dữ liệu từ localStorage và hiển thị thành table/dashboard thực thụ.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link id="leads-back-to-new" href="/leads/new" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200">
            Tạo lead mới
          </Link>
          <Link id="leads-back-home" href="/" className="rounded-full border border-white/12 px-6 py-3 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/6">
            Về tổng quan
          </Link>
        </div>
      </div>

      <div className="rounded-[30px] border border-white/10 bg-white/6 p-7 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">Next up</p>
        <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
          {plannedFeatures.map((feature) => (
            <li key={feature} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4">
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
