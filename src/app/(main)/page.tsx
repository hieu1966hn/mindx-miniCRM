"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLeads } from "@/contexts/LeadContext";
import type { Lead } from "@/types/lead";
import { getLeadTemperature } from "@/utils/leadPriority";

const STATUS_ORDER: Lead["status"][] = ["New", "Contacting", "Interested", "Converted", "Lost"];

const statusToneMap: Record<Lead["status"], string> = {
  New: "from-cyan-400/18 to-cyan-300/6 border-cyan-300/18",
  Contacting: "from-sky-400/18 to-sky-300/6 border-sky-300/18",
  Interested: "from-violet-400/18 to-fuchsia-300/6 border-violet-300/18",
  Converted: "from-emerald-400/18 to-emerald-300/6 border-emerald-300/18",
  Lost: "from-slate-400/18 to-slate-300/6 border-white/10",
};

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

    const averageScore =
      totalLeads === 0 ? 0 : Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads);

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
      const key = lead.leadSource || "Unknown";
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

    const ownerMap = new Map<string, number>();
    for (const lead of leads) {
      ownerMap.set(lead.assignedTo, (ownerMap.get(lead.assignedTo) ?? 0) + 1);
    }

    const topOwners = [...ownerMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([owner, count]) => ({ owner, count }));

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
      topOwners,
    };
  }, [leads]);

  const statCards = [
    {
      id: "dashboard-total-leads",
      label: "Tổng lead",
      value: dashboard.totalLeads.toString(),
      hint: "Tổng số lead đang nằm trong local pipeline",
      accent: "from-cyan-400/20 to-cyan-300/5",
    },
    {
      id: "dashboard-hot-leads",
      label: "Lead nóng",
      value: `${dashboard.hotLeads}`,
      hint: `${formatPercent(dashboard.hotRate)} trong tổng pipeline`,
      accent: "from-emerald-400/18 to-emerald-300/5",
    },
    {
      id: "dashboard-average-score",
      label: "Điểm trung bình",
      value: `${dashboard.averageScore}/100`,
      hint: "Đại diện cho chất lượng intake hiện tại",
      accent: "from-violet-400/18 to-fuchsia-300/5",
    },
    {
      id: "dashboard-conversion-rate",
      label: "Tỷ lệ chuyển đổi",
      value: formatPercent(dashboard.conversionRate),
      hint: `${dashboard.convertedLeads} lead đã Converted`,
      accent: "from-amber-300/18 to-orange-300/5",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/45 p-7">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_55%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Round 8 • Dashboard</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl">
              Command center cho admissions team: nhìn nhanh pipeline, biết ngay ai cần được chạm trước.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Trang chủ giờ không còn là overview tĩnh. Nó đã trở thành dashboard vận hành với KPI, funnel, nguồn lead và danh sách lead ưu tiên lấy trực tiếp từ dữ liệu hiện có trong app.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                id="dashboard-create-lead"
                href="/leads/new"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
              >
                Tạo lead mới
              </Link>
              <Link
                id="dashboard-open-board"
                href="/leads"
                className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/6"
              >
                Mở leads board
              </Link>
            </div>
          </div>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">Routing spotlight</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Team đang gánh nhiều lead nhất</h2>
          <div className="mt-5 space-y-3">
            {dashboard.topOwners.length > 0 ? (
              dashboard.topOwners.map((owner, index) => (
                <div
                  key={owner.owner}
                  className="flex items-center justify-between rounded-[22px] border border-white/8 bg-slate-950/50 px-4 py-4"
                >
                  <div>
                    <p className="text-sm text-slate-400">Top {index + 1}</p>
                    <p className="mt-1 font-medium text-white">{owner.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-white">{owner.count}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">lead</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-slate-950/40 px-4 py-6 text-sm leading-7 text-slate-300">
                Chưa có lead để hiển thị phân bổ owner. Hãy tạo lead đầu tiên để dashboard bắt đầu phản ánh tải vận hành.
              </div>
            )}
          </div>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {statCards.map((card) => (
          <article
            key={card.id}
            id={card.id}
            className={`rounded-[26px] border border-white/10 bg-gradient-to-br ${card.accent} p-5 shadow-[0_18px_40px_rgba(2,6,23,0.24)]`}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold text-white">{card.value}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{card.hint}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[30px] border border-white/10 bg-slate-950/45 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">Pipeline funnel</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Tỷ trọng theo từng trạng thái</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
              Live from context
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {dashboard.pipeline.map((item) => (
              <div
                key={item.status}
                className={`rounded-[24px] border bg-gradient-to-br p-4 ${statusToneMap[item.status]}`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.status}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.count}</p>
                <p className="mt-2 text-sm text-slate-300">{formatPercent(item.share)} pipeline</p>
                <div className="mt-4 h-2 rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-white/80"
                    style={{ width: `${Math.max(item.share, item.count > 0 ? 10 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200/75">Top sources</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Nguồn lead mang về nhiều volume nhất</h2>
          <div className="mt-6 space-y-4">
            {dashboard.topSources.length > 0 ? (
              dashboard.topSources.map((item) => (
                <div key={item.source} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-white">{item.source}</span>
                    <span className="text-slate-300">{item.count} lead • {formatPercent(item.share)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-300 via-cyan-300 to-fuchsia-300"
                      style={{ width: `${Math.max(item.share, 12)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-slate-950/40 px-4 py-6 text-sm leading-7 text-slate-300">
                Chưa có đủ dữ liệu nguồn lead để biểu diễn. Sau khi thêm lead, bảng phân tích nguồn sẽ tự cập nhật.
              </div>
            )}
          </div>
        </article>
      </div>

      <article className="rounded-[30px] border border-white/10 bg-slate-950/45 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/75">Priority queue</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Lead cần follow-up sớm nhất</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Sắp xếp theo score giảm dần, sau đó ưu tiên lead mới hơn. Đây là phần dashboard phù hợp nhất để team admissions mở đầu mỗi ca làm việc.
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-5">
          {dashboard.priorityLeads.length > 0 ? (
            dashboard.priorityLeads.map((lead) => {
              const temperature = getLeadTemperature(lead.score);
              return (
                <article
                  key={lead.id}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/8"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{lead.fullName}</p>
                      <p className="mt-1 text-sm text-slate-400">{lead.programInterest || "Chưa chọn chương trình"}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${temperature.badgeClassName}`}>
                      {temperature.label}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-3">
                      <span>Score</span>
                      <span className="font-semibold text-white">{lead.score}/100</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Status</span>
                      <span className="font-semibold text-white">{lead.status}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Owner</span>
                      <span className="text-right font-semibold text-white">{lead.assignedTo}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Created</span>
                      <span className="font-semibold text-white">{formatRelativeTime(lead.createdAt)}</span>
                    </div>
                  </div>

                  <Link
                    id={`dashboard-lead-detail-${lead.id}`}
                    href={`/leads/${lead.id}`}
                    className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/6"
                  >
                    Xem chi tiết
                  </Link>
                </article>
              );
            })
          ) : (
            <div className="xl:col-span-5 rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-sm leading-7 text-slate-300">
              Dashboard đang chờ dữ liệu đầu vào. Hãy tạo vài lead để xem KPI, funnel và priority queue hoạt động.
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
