"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useLeads } from "@/contexts/LeadContext";
import { Lead } from "@/types/lead";
import { getLeadTemperature } from "@/utils/leadPriority";
import { useRouter } from "next/navigation";

const STATUS_COLORS: Record<Lead["status"], string> = {
  New: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  Contacting: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  Interested: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200",
  Converted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  Lost: "border-slate-500/30 bg-slate-500/10 text-slate-400",
};

interface LeadTableProps {
  displayLeads?: Lead[];
  highlightedLeadId?: string;
}

export function LeadTable({ displayLeads, highlightedLeadId }: LeadTableProps) {
  const { leads, deleteLead } = useLeads();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const listToRender = displayLeads ?? leads;

  if (listToRender.length === 0) {
    return (
      <div className="glass-panel-strong flex min-h-[420px] flex-col items-center justify-center space-y-5 rounded-[30px] p-8 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/6 shadow-[0_18px_40px_rgba(2,6,23,0.32)]">
          <svg className="h-11 w-11 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl text-white">Chưa có lead nào</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
            Bắt đầu bằng vài lead đầu tiên để kích hoạt pipeline, scoring và các tín hiệu ưu tiên ở khu vực danh sách.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-strong overflow-hidden rounded-[30px]">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.22em] text-cyan-200/60">
            <tr>
              <th className="px-6 py-5 font-medium">Khách hàng</th>
              <th className="px-6 py-5 font-medium">Chương trình / Cơ sở</th>
              <th className="px-6 py-5 font-medium">Trạng thái</th>
              <th className="px-6 py-5 font-medium">Điểm / Nguồn</th>
              <th className="px-6 py-5 font-medium">Ngày tạo</th>
              <th className="px-6 py-5 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {listToRender.map((lead) => {
              const isHighlighted = highlightedLeadId === lead.id;

              return (
                <tr
                  key={lead.id}
                  className={[
                    "group cursor-pointer bg-transparent transition duration-300 hover:bg-white/[0.045]",
                    isHighlighted
                      ? "bg-emerald-400/[0.08] ring-1 ring-inset ring-emerald-300/35 shadow-[inset_0_0_0_1px_rgba(110,231,183,0.14)]"
                      : "",
                  ].join(" ")}
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-slate-950 shadow-[0_14px_28px_rgba(34,211,238,0.18)]",
                        isHighlighted
                          ? "bg-gradient-to-br from-emerald-200 via-cyan-300 to-sky-300"
                          : "bg-gradient-to-br from-cyan-300 via-sky-400 to-fuchsia-400",
                      ].join(" ")}
                    >
                      {lead.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-white transition-colors group-hover:text-cyan-200">{lead.fullName}</div>
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
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] ${STATUS_COLORS[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const scoreTier = getLeadTemperature(lead.score);
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
                            ★ {lead.score}
                          </span>
                          <span className={`text-xs font-semibold uppercase tracking-[0.16em] ${scoreTier.textClassName}`}>
                            {scoreTier.label}
                          </span>
                        </div>
                        <div className="inline-flex max-w-[220px] items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                          {lead.assignedTo}
                        </div>
                        <div className="text-xs text-slate-500">{lead.leadSource}</div>
                      </div>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-400 transition duration-300 hover:border-cyan-500/45 hover:bg-cyan-500/10 hover:text-cyan-300"
                      title="Chi tiết"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <button
                      id={`delete-lead-${lead.id}`}
                      onClick={() => {
                        if (confirm("Xóa lead này?"))
                          startTransition(async () => {
                            await deleteLead(lead.id);
                          });
                      }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-400 transition duration-300 hover:border-rose-500/45 hover:bg-rose-500/10 hover:text-rose-400"
                      title="Xóa"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
