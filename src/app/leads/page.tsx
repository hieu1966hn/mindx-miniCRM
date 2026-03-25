import Link from "next/link";
import type { Metadata } from "next";
import { LeadTable } from "@/components/leads/LeadTable";

export const metadata: Metadata = {
  title: "Danh sách Lead | MindX Mini CRM",
  description: "Trang danh sách lead quản lý dữ liệu từ localStorage với giao diện premium.",
};

export default function LeadsPage() {
  return (
    <section className="grid gap-6">
      <div className="rounded-[30px] border border-white/10 bg-slate-950/50 p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Leads board</p>
            <h3 className="mt-3 font-serif text-4xl text-white">Quản lý Lead tinh gọn.</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Vòng 3 hoàn thiện bảng hiển thị lead, kết nối trực tiếp với LeadContext và localStorage. 
              Dữ liệu được cập nhật thời gian thực ngay khi bạn thêm lead mới.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link id="leads-back-to-new" href="/leads/new" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200">
              Tạo lead mới
            </Link>
          </div>
        </div>
      </div>

      <LeadTable />

      <div className="rounded-[30px] border border-white/10 bg-white/6 p-7 backdrop-blur-xl lg:px-10">
        <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">Vòng 3 • Goals</p>
        <ul className="mt-6 grid gap-4 text-sm leading-7 text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Bảng lead responsive
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Gắn màu status badge
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Xử lý logic Xóa lead
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Tối ưu UX cho danh sách
          </li>
        </ul>
      </div>
    </section>
  );
}
