"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useLeads } from "@/contexts/LeadContext";
import { Lead } from "@/types/lead";
import { getLeadTemperature } from "@/utils/leadPriority";
import { useRouter } from "next/navigation";
import { Inbox, Trash2, ArrowRight } from "lucide-react";

const STATUS_COLORS: Record<Lead["status"], string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Contacting: "bg-amber-50 text-amber-700 border-amber-200",
  Interested: "bg-purple-50 text-purple-700 border-purple-200",
  Converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Lost: "bg-slate-100 text-slate-700 border-slate-200",
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
      <div className="flex min-h-[420px] flex-col items-center justify-center space-y-5 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100">
          <Inbox size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Chưa có lead nào</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Bắt đầu bằng vài lead đầu tiên để kích hoạt pipeline, scoring và các tín hiệu ưu tiên ở khu vực danh sách.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Chương trình / Cơ sở</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Điểm / Nguồn</th>
              <th className="px-6 py-4">Ngày tạo</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listToRender.map((lead) => {
              const isHighlighted = highlightedLeadId === lead.id;
              const temperature = getLeadTemperature(lead.score);

              return (
                <tr
                  key={lead.id}
                  className={[
                    "group cursor-pointer transition-colors duration-200 hover:bg-slate-50",
                    isHighlighted ? "bg-red-50/50" : "",
                  ].join(" ")}
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700 group-hover:bg-slate-200 transition-colors">
                        {lead.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 transition-colors group-hover:text-red-600">
                          {lead.fullName}
                        </div>
                        <div className="text-xs text-slate-500">{lead.phone || lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-900">{lead.programInterest || "Chưa xác định"}</div>
                      <div className="text-xs text-slate-500">{lead.campusOrRegion || "Chưa xác định"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                         <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${lead.score >= 70 ? 'bg-red-100 text-red-700' : lead.score >= 40 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                           {lead.score}
                         </span>
                         <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">{temperature.label}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span className="truncate max-w-[120px]">{lead.assignedTo || "Chưa giao"}</span>
                        <span>•</span>
                        <span className="truncate max-w-[100px]">{lead.leadSource}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        id={`delete-lead-${lead.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (confirm("Xóa lead này?")) {
                            startTransition(async () => {
                              await deleteLead(lead.id);
                            });
                          }
                        }}
                        className="rounded-md p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                      <Link
                        href={`/leads/${lead.id}`}
                        className="rounded-md p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        title="Chi tiết"
                      >
                        <ArrowRight size={16} />
                      </Link>
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
