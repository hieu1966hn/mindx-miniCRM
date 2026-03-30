"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLeads } from "@/contexts/LeadContext";
import type { Lead } from "@/types/lead";
import { getLeadTemperature } from "@/utils/leadPriority";
import { Users, Flame, Percent, Activity, PlusCircle } from "lucide-react";

const STATUS_ORDER: Lead["status"][] = ["New", "Contacting", "Interested", "Converted", "Lost"];

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function formatRelativeTime(dateString: string) {
  const created = new Date(dateString).getTime();
  const now = Date.now();
  const diffHours = Math.max(1, Math.round((now - created) / (1000 * 60 * 60)));

  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} ngày trước`;
}

export default function Home() {
  const { leads } = useLeads();

  const dashboard = useMemo(() => {
    const totalLeads = leads.length;
    const convertedLeads = leads.filter((lead) => lead.status === "Converted").length;
    const hotLeads = leads.filter((lead) => getLeadTemperature(lead.score).key === "hot");
    const priorityLeads = [...leads]
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 5);

    const averageScore = totalLeads === 0 ? 0 : Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads);
    const conversionRate = totalLeads === 0 ? 0 : (convertedLeads / totalLeads) * 100;
    const hotRate = totalLeads === 0 ? 0 : (hotLeads.length / totalLeads) * 100;

    const pipeline = STATUS_ORDER.map((status) => {
      const count = leads.filter((lead) => lead.status === status).length;
      return {
        status,
        count,
        share: totalLeads === 0 ? 0 : (count / totalLeads) * 100,
      };
    });

    const sourceMap = new Map<string, number>();
    for (const lead of leads) {
      const key = lead.leadSource || "Chưa xác định";
      sourceMap.set(key, (sourceMap.get(key) ?? 0) + 1);
    }

    const topSources = [...sourceMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([source, count]) => ({
        source,
        count,
        share: totalLeads === 0 ? 0 : (count / totalLeads) * 100,
      }));

    return {
      totalLeads,
      convertedLeads,
      averageScore,
      conversionRate,
      hotLeads: hotLeads.length,
      hotRate,
      pipeline,
      topSources,
      priorityLeads,
    };
  }, [leads]);

  const statCards = [
    {
      id: "dashboard-total-leads",
      label: "Tổng lead",
      value: dashboard.totalLeads.toString(),
      hint: "Pipeline hiện tại",
      Icon: Users,
    },
    {
      id: "dashboard-hot-leads",
      label: "Lead nóng",
      value: `${dashboard.hotLeads}`,
      hint: `${formatPercent(dashboard.hotRate)} tổng số`,
      Icon: Flame,
    },
    {
      id: "dashboard-average-score",
      label: "Điểm trung bình",
      value: `${dashboard.averageScore}/100`,
      hint: "Chất lượng đầu vào",
      Icon: Activity,
    },
    {
      id: "dashboard-conversion-rate",
      label: "Chuyển đổi",
      value: formatPercent(dashboard.conversionRate),
      hint: `${dashboard.convertedLeads} lead đã chốt`,
      Icon: Percent,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Cái nhìn tổng quan về trạng thái pipeline của bạn.</p>
        </div>
        <Link
          href="/leads/new"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm inline-flex items-center gap-2 text-sm"
        >
          <PlusCircle size={18} />
          Tạo lead mới
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.Icon;
          return (
            <div key={card.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{card.label}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                  <Icon size={18} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-slate-900">{card.value}</span>
              </div>
              <div className="mt-1 text-sm text-slate-500">{card.hint}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pipeline funnel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900">Tỷ trọng Pipeline</h2>
          <p className="text-sm text-slate-500 mt-1">Phân tích mật độ lead theo các trạng thái</p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
             {dashboard.pipeline.map((item) => (
                <div key={item.status} className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100">
                   <div className="text-xs font-semibold text-slate-500 uppercase">{item.status}</div>
                   <div className="mt-2 text-2xl font-bold text-slate-900">{item.count}</div>
                   <div className="text-sm text-slate-500 mb-3">{formatPercent(item.share)}</div>
                   <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: `${item.share}%` }}></div>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Top sources */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900">Nguồn Lead</h2>
          <p className="text-sm text-slate-500 mt-1">Đóng góp của các kênh</p>
          
          <div className="mt-6 space-y-4">
            {dashboard.topSources.length > 0 ? (
               dashboard.topSources.map((item) => (
                 <div key={item.source}>
                    <div className="flex justify-between items-center text-sm mb-1">
                       <span className="font-medium text-slate-700">{item.source}</span>
                       <span className="text-slate-500">{item.count} ({formatPercent(item.share)})</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-slate-300 rounded-full" style={{ width: `${Math.max(item.share, 5)}%` }}></div>
                    </div>
                 </div>
               ))
            ) : (
                <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg">Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>

      {/* Priority Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900">Lead cần theo dõi</h2>
        <p className="text-sm text-slate-500 mt-1">Danh sách lead đang nóng, cần chuyển đổi sớm.</p>
        
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                 <th className="p-4 font-semibold uppercase text-xs">Lead</th>
                 <th className="p-4 font-semibold uppercase text-xs">Điểm</th>
                 <th className="p-4 font-semibold uppercase text-xs">Trạng thái</th>
                 <th className="p-4 font-semibold uppercase text-xs">Người phụ trách</th>
                 <th className="p-4 font-semibold uppercase text-xs">Tạo lúc</th>
                 <th className="p-4 font-semibold uppercase text-xs text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {dashboard.priorityLeads.length > 0 ? (
                  dashboard.priorityLeads.map((lead) => {
                     return (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                           <td className="p-4">
                              <div className="font-medium text-slate-900">{lead.fullName}</div>
                              <div className="text-slate-500 text-xs mt-0.5">{lead.programInterest || 'Không rõ'}</div>
                           </td>
                           <td className="p-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${lead.score >= 70 ? 'bg-red-50 text-red-700' : lead.score >= 40 ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                                {lead.score}
                              </span>
                           </td>
                           <td className="p-4">
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                 {lead.status}
                              </span>
                           </td>
                           <td className="p-4">{lead.assignedTo}</td>
                           <td className="p-4 text-slate-500">{formatRelativeTime(lead.createdAt)}</td>
                           <td className="p-4 text-right">
                              <Link href={`/leads/${lead.id}`} className="text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 hover:bg-slate-100 rounded-md transition-colors inline-block">Chi tiết</Link>
                           </td>
                        </tr>
                     )
                  })
               ) : (
                  <tr>
                     <td colSpan={6} className="p-8 text-center text-slate-500">Chưa có lead nào</td>
                  </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
