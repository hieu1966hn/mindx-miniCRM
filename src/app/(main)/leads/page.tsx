"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { useLeads } from "@/contexts/LeadContext";
import { Lead } from "@/types/lead";
import { getLeadTemperature } from "@/utils/leadPriority";

const STATUS_ORDER: Lead["status"][] = ["New", "Contacting", "Interested", "Converted", "Lost"];
const STATUS_TONES: Record<Lead["status"], string> = {
  New: "from-cyan-400/30 to-cyan-500/10 text-cyan-100",
  Contacting: "from-amber-300/30 to-amber-500/10 text-amber-100",
  Interested: "from-fuchsia-400/30 to-fuchsia-500/10 text-fuchsia-100",
  Converted: "from-emerald-400/30 to-emerald-500/10 text-emerald-100",
  Lost: "from-slate-400/20 to-slate-500/10 text-slate-200",
};

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function escapeCsvValue(value: string | number) {
  const normalized = String(value ?? "").replace(/"/g, '""');
  return `"${normalized}"`;
}

function LeadsPageContent() {
  const { leads } = useLeads();
  const router = useRouter();
  const searchParams = useSearchParams();
  const createdLeadId = searchParams.get("created")?.trim() ?? "";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!createdLeadId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.replace("/leads", { scroll: false });
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [createdLeadId, router]);

  const createdLead = useMemo(
    () => leads.find((lead) => lead.id === createdLeadId),
    [createdLeadId, leads]
  );

  const hasActiveFilters = Boolean(searchTerm || statusFilter || sourceFilter || scoreFilter);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSourceFilter("");
    setScoreFilter("");
    setSortBy("newest");
  };

  const filteredAndSortedLeads = useMemo(() => {
    const result = [...leads];

    const filtered = result.filter((lead) => {
      const lowSearch = searchTerm.trim().toLowerCase();
      const matchesSearch = !lowSearch
        ? true
        : lead.fullName.toLowerCase().includes(lowSearch) ||
          lead.phone.toLowerCase().includes(lowSearch) ||
          lead.email.toLowerCase().includes(lowSearch);

      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesSource = !sourceFilter || lead.leadSource === sourceFilter;
      const matchesScore = !scoreFilter || getLeadTemperature(lead.score).key === scoreFilter;

      return matchesSearch && matchesStatus && matchesSource && matchesScore;
    });

    filtered.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "name") return a.fullName.localeCompare(b.fullName);
      return 0;
    });

    return filtered;
  }, [leads, scoreFilter, searchTerm, sortBy, sourceFilter, statusFilter]);

  const dashboard = useMemo(() => {
    const totalLeads = leads.length;
    const visibleLeads = filteredAndSortedLeads.length;
    const hotLeads = leads.filter((lead) => getLeadTemperature(lead.score).key === "hot").length;
    const warmLeads = leads.filter((lead) => getLeadTemperature(lead.score).key === "warm").length;
    const convertedLeads = leads.filter((lead) => lead.status === "Converted").length;
    const interestedLeads = leads.filter((lead) => lead.status === "Interested").length;
    const avgScore = totalLeads ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads) : 0;
    const conversionRate = totalLeads ? (convertedLeads / totalLeads) * 100 : 0;
    const closeReady = interestedLeads + convertedLeads;

    const statusBreakdown = STATUS_ORDER.map((status) => {
      const count = leads.filter((lead) => lead.status === status).length;
      return {
        status,
        count,
        share: totalLeads ? (count / totalLeads) * 100 : 0,
      };
    });

    const ownerBreakdown = Object.entries(
      leads.reduce<Record<string, number>>((acc, lead) => {
        acc[lead.assignedTo] = (acc[lead.assignedTo] ?? 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([owner, count]) => ({
        owner,
        count,
        share: totalLeads ? (count / totalLeads) * 100 : 0,
      }));

    const sourceBreakdown = Object.entries(
      leads.reduce<Record<string, number>>((acc, lead) => {
        acc[lead.leadSource] = (acc[lead.leadSource] ?? 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({
        source,
        count,
        share: totalLeads ? (count / totalLeads) * 100 : 0,
      }));

    const recentLeads = [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    return {
      totalLeads,
      visibleLeads,
      hotLeads,
      warmLeads,
      convertedLeads,
      interestedLeads,
      avgScore,
      conversionRate,
      closeReady,
      statusBreakdown,
      ownerBreakdown,
      sourceBreakdown,
      recentLeads,
    };
  }, [filteredAndSortedLeads.length, leads]);

  const handleExportCsv = () => {
    if (filteredAndSortedLeads.length === 0) {
      return;
    }

    const headers = [
      "Full Name",
      "Phone",
      "Email",
      "Status",
      "Score",
      "Temperature",
      "Assigned To",
      "Routing Mode",
      "Program Interest",
      "Campus/Region",
      "Lead Source",
      "Created At",
    ];

    const rows = filteredAndSortedLeads.map((lead) => [
      lead.fullName,
      lead.phone,
      lead.email,
      lead.status,
      lead.score,
      getLeadTemperature(lead.score).label,
      lead.assignedTo,
      lead.routingMode,
      lead.programInterest,
      lead.campusOrRegion,
      lead.leadSource,
      new Date(lead.createdAt).toLocaleString("vi-VN"),
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mini-crm-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="grid gap-6">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/60 p-7 shadow-[0_24px_80px_rgba(8,15,37,0.45)]">
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.20),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(217,70,239,0.18),transparent_35%)]" />
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">Leads • Pipeline view</p>
            <h3 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
              Danh sách lead để lọc nhanh, ưu tiên đúng và follow-up không trượt nhịp.
            </h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Đây là mặt bàn làm việc chính cho team tuyển sinh: tìm lead theo trạng thái, nguồn,
              nhiệt độ, rồi xuất nhanh danh sách đang hiển thị hoặc tạo lead mới ngay khi có data vào.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            <button
              id="export-filtered-csv"
              type="button"
              onClick={handleExportCsv}
              disabled={filteredAndSortedLeads.length === 0}
              className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Export danh sách đang lọc
            </button>
            <Link
              id="leads-back-to-new"
              href="/leads/new"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              + Thêm lead mới
            </Link>
          </div>
        </div>

        {createdLead ? (
          <div className="relative mt-6 overflow-hidden rounded-[26px] border border-emerald-300/25 bg-[linear-gradient(135deg,rgba(16,185,129,0.20),rgba(6,182,212,0.10))] p-4 text-emerald-50 shadow-[0_20px_60px_rgba(16,185,129,0.16)]">
            <div className="absolute inset-y-0 left-0 w-1 bg-emerald-300/90" />
            <div className="pl-4">
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/80">Lead created successfully</p>
              <p className="mt-2 text-base font-semibold sm:text-lg">
                Đã tạo lead <span className="text-white">{createdLead.fullName}</span> và thêm vào pipeline.
              </p>
              <p className="mt-1 text-sm text-emerald-100/80">
                Hàng vừa tạo đang được highlight bên dưới để bạn kiểm tra nhanh.
              </p>
            </div>
          </div>
        ) : null}

        <div className="relative mt-8 grid gap-3 sm:grid-cols-2 2xl:grid-cols-5">
          {[
            {
              label: "Visible now",
              value: dashboard.visibleLeads,
              hint: `${dashboard.totalLeads} lead trong hệ thống`,
              tone: "text-cyan-100",
            },
            {
              label: "Avg. score",
              value: dashboard.avgScore,
              hint: `${dashboard.hotLeads} hot / ${dashboard.warmLeads} warm`,
              tone: "text-amber-100",
            },
            {
              label: "Close-ready",
              value: dashboard.closeReady,
              hint: `${dashboard.interestedLeads} interested + ${dashboard.convertedLeads} converted`,
              tone: "text-fuchsia-100",
            },
            {
              label: "Conversion",
              value: formatPercent(dashboard.conversionRate),
              hint: `${dashboard.convertedLeads} lead đã convert`,
              tone: "text-emerald-100",
            },
            {
              label: "Focus queue",
              value: dashboard.hotLeads,
              hint: "Số lead cần follow-up sớm",
              tone: "text-rose-100",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-4 backdrop-blur"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{metric.label}</p>
              <p className={`mt-3 text-3xl font-semibold ${metric.tone}`}>{metric.value}</p>
              <p className="mt-3 text-sm text-slate-400">{metric.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-6">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">Pipeline distribution</p>
                <h4 className="mt-2 text-2xl text-white">Phân bố theo trạng thái</h4>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                Live from local data
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              {dashboard.statusBreakdown.map((item) => (
                <div key={item.status} className="rounded-[24px] border border-white/8 bg-slate-950/45 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.status}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                        {item.count} lead • {formatPercent(item.share)} pipeline
                      </p>
                    </div>
                    <div className={`rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${STATUS_TONES[item.status]}`}>
                      {item.count}
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/6">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${STATUS_TONES[item.status].split(" text-")[0]}`}
                      style={{ width: `${Math.max(item.share, item.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <LeadFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sourceFilter={sourceFilter}
            onSourceChange={setSourceFilter}
            scoreFilter={scoreFilter}
            onScoreChange={setScoreFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
          />

          {filteredAndSortedLeads.length > 0 || leads.length === 0 ? (
            <LeadTable displayLeads={filteredAndSortedLeads} highlightedLeadId={createdLeadId} />
          ) : (
            <div className="rounded-[30px] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.56))] p-8 text-center shadow-[0_24px_80px_rgba(8,15,37,0.35)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.14)]">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m1.85-5.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
                </svg>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.28em] text-cyan-200/75">No matching leads</p>
              <h4 className="mt-3 text-3xl text-white">Không có lead nào khớp bộ lọc hiện tại</h4>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Hãy nới bộ lọc, đổi từ khóa tìm kiếm hoặc reset toàn bộ để quay lại dashboard đầy đủ.
                Đây là empty state dành riêng cho search/filter, khác với trạng thái chưa có dữ liệu.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  id="clear-empty-state-filters"
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/15"
                >
                  Xóa bộ lọc hiện tại
                </button>
                <Link
                  id="empty-state-create-lead"
                  href="/leads/new"
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
                >
                  Tạo lead mới
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Query: {searchTerm || "none"}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Status: {statusFilter || "all"}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Source: {sourceFilter || "all"}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Score: {scoreFilter || "all"}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Sort: {sortBy}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 content-start">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">Source pulse</p>
            <h4 className="mt-2 text-2xl text-white">Nguồn vào đang kéo pipeline</h4>
            <div className="mt-6 space-y-4">
              {dashboard.sourceBreakdown.length > 0 ? (
                dashboard.sourceBreakdown.map((item) => (
                  <div key={item.source} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-200">{item.source}</span>
                      <span className="text-slate-400">{item.count} lead</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/6">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.9),rgba(217,70,239,0.8))]"
                        style={{ width: `${Math.max(item.share, 10)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Chưa có dữ liệu nguồn để phân tích.</p>
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200/75">Owner load</p>
            <h4 className="mt-2 text-2xl text-white">Ai đang giữ nhiều lead nhất</h4>
            <div className="mt-6 space-y-3">
              {dashboard.ownerBreakdown.length > 0 ? (
                dashboard.ownerBreakdown.map((item, index) => (
                  <div key={item.owner} className="flex items-center justify-between rounded-[24px] border border-white/8 bg-slate-950/45 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-sm font-semibold text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{item.owner}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                          {formatPercent(item.share)} tổng pipeline
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-cyan-100">{item.count}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Chưa có owner assignment để hiển thị.</p>
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">Recent movement</p>
            <h4 className="mt-2 text-2xl text-white">Lead mới vào gần đây</h4>
            <div className="mt-6 space-y-3">
              {dashboard.recentLeads.length > 0 ? (
                dashboard.recentLeads.map((lead) => {
                  const temperature = getLeadTemperature(lead.score);
                  return (
                    <div key={lead.id} className="rounded-[24px] border border-white/8 bg-slate-950/45 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{lead.fullName}</p>
                          <p className="mt-1 text-sm text-slate-400">
                            {lead.programInterest} • {lead.campusOrRegion}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${temperature.textClassName}`}>
                          {temperature.label}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{lead.status}</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{lead.assignedTo}</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{lead.leadSource}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-400">Tạo lead đầu tiên để thấy recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[30px] border border-white/10 bg-white/6 p-7 backdrop-blur-xl lg:px-10">
        <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">Vòng 8 • Dashboard + Polish</p>
        <ul className="mt-6 grid gap-4 text-sm leading-7 text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            KPI hero + conversion snapshot
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Breakdown theo status/source/owner
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            CSV export theo danh sách đang lọc
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Board polish responsive, giàu tín hiệu hơn
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          <span className={`rounded-full border px-3 py-1 ${hasActiveFilters ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100" : "border-white/10 bg-white/5 text-slate-400"}`}>
            Filter state: {hasActiveFilters ? "active" : "clean"}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Reset UX added</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Search empty-state handled</span>
        </div>
      </div>
    </section>
  );
}

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <section className="grid gap-6">
          <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-7 shadow-[0_24px_80px_rgba(8,15,37,0.45)]">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">Dashboard • Loading</p>
            <h3 className="mt-3 font-serif text-4xl text-white sm:text-5xl">Đang tải pipeline leads…</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Hệ thống đang khởi tạo bộ lọc và đồng bộ trạng thái dashboard.
            </p>
          </div>
        </section>
      }
    >
      <LeadsPageContent />
    </Suspense>
  );
}
