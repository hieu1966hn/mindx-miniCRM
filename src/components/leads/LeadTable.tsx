"use client";

import { useLeads } from "@/contexts/LeadContext";
import { Lead } from "@/types/lead";

const STATUS_COLORS: Record<Lead["status"], string> = {
  New: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  Contacting: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  Interested: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200",
  Converted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  Lost: "border-slate-500/30 bg-slate-500/10 text-slate-400",
};

export function LeadTable() {
  const { leads, deleteLead } = useLeads();

  if (leads.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-[30px] border border-dashed border-white/10 bg-white/5 text-center p-8">
        <div className="h-20 w-20 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
          <svg className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-medium text-white">Chưa có lead nào</h3>
          <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
            Bắt đầu Vòng 3 bằng cách nhập vài lead từ form "Thêm Lead" để thấy dữ liệu xuất hiện ở đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[30px] border border-white/10 bg-slate-950/60 shadow-2xl backdrop-blur">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-cyan-200/60">
          <tr>
            <th className="px-6 py-5 font-medium">Khách hàng</th>
            <th className="px-6 py-5 font-medium">Chương trình / Cơ sở</th>
            <th className="px-6 py-5 font-medium">Trạng thái</th>
            <th className="px-6 py-5 font-medium">Điểm / Nguồn</th>
            <th className="px-6 py-5 font-medium">Ngày tạo</th>
            <th className="px-6 py-5 font-medium text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {leads.map((lead) => (
            <tr key={lead.id} className="group transition hover:bg-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
                    {lead.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{lead.fullName}</div>
                    <div className="text-xs text-slate-400">{lead.phone || lead.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <div className="text-white">{lead.programInterest}</div>
                  <div className="text-xs text-slate-500">{lead.campusOrRegion}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.05em] ${STATUS_COLORS[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">★ {lead.score}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{lead.leadSource}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-400">
                {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => {
                    if (confirm("Xóa lead này?")) deleteLead(lead.id);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
