"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { useLeads } from "@/contexts/LeadContext";
import { Lead } from "@/types/lead";
import { getLeadTemperature } from "@/utils/leadPriority";
import { Download, PlusCircle, CheckCircle2, AlertCircle } from "lucide-react";

const STATUS_ORDER: Lead["status"][] = ["New", "Contacting", "Interested", "Converted", "Lost"];
const STATUS_COLORS: Record<Lead["status"], { bg: string, text: string, bar: string }> = {
  New: { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-400" },
  Contacting: { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-400" },
  Interested: { bg: "bg-purple-50", text: "text-purple-700", bar: "bg-purple-400" },
  Converted: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-400" },
  Lost: { bg: "bg-slate-100", text: "text-slate-700", bar: "bg-slate-400" },
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
  const globalQuery = searchParams.get("q")?.trim() ?? "";

  const [searchTerm, setSearchTerm] = useState(globalQuery);
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

  useEffect(() => {
    setSearchTerm(globalQuery);
  }, [globalQuery]);

  const createdLead = useMemo(
    () => leads.find((lead) => lead.id === createdLeadId),
    [createdLeadId, leads]
  );

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
      .slice(0, 4);

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
    <section className="mx-auto max-w-7xl space-y-6">
      {/* Header Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold text-slate-900">Pipeline lead</h1>
          <p className="mt-1 text-sm text-slate-500">
            Danh sách lead để lọc nhanh, theo dõi ưu tiên và quản lý follow-up hàng ngày.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="export-filtered-csv"
            type="button"
            onClick={handleExportCsv}
            disabled={filteredAndSortedLeads.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={18} />
            Xuất CSV
          </button>
          <Link
            id="leads-back-to-new"
            href="/leads/new"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
          >
            <PlusCircle size={18} />
            Thêm lead mới
          </Link>
        </div>
      </div>

      {/* Created Lead Banner */}
      {createdLead && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Đã tạo lead <span className="font-bold">{createdLead.fullName}</span> thành công!
              </p>
              <p className="mt-0.5 text-xs text-green-600">
                Lead đã được thêm vào pipeline và đang được đánh dấu nổi bật trong danh sách bên dưới.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Highlights */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Hiển thị hiện tại",
            value: dashboard.visibleLeads,
            hint: `Trên tổng số ${dashboard.totalLeads} lead`,
            color: "text-blue-600",
          },
          {
            label: "Điểm trung bình",
            value: dashboard.avgScore,
            hint: `${dashboard.hotLeads} hot / ${dashboard.warmLeads} warm`,
            color: "text-amber-600",
          },
          {
            label: "Sẵn sàng chốt",
            value: dashboard.closeReady,
            hint: `Interested + Converted`,
            color: "text-purple-600",
          },
          {
            label: "Tỉ lệ chuyển đổi",
            value: formatPercent(dashboard.conversionRate),
            hint: `${dashboard.convertedLeads} lead thành công`,
            color: "text-emerald-600",
          },
          {
            label: "Hàng chờ ưu tiên",
            value: dashboard.hotLeads,
            hint: "Nóng cần follow-up gấp",
            color: "text-red-600",
          },
        ].map((metric, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {metric.label}
            </p>
            <p className={`mt-3 text-3xl font-bold ${metric.color}`}>
              {metric.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{metric.hint}</p>
          </div>
        ))}
      </div>

      {/* Breakdown Area */}
      <div className="grid gap-6 lg:grid-cols-12">
         {/* Status Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">
          <h2 className="text-base font-bold text-slate-900">Phân bố trạng thái</h2>
          <div className="mt-5 space-y-4">
            {dashboard.statusBreakdown.map((item) => (
              <div key={item.status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.status}</span>
                  <span className="text-slate-500">
                    {item.count} ({formatPercent(item.share)})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${STATUS_COLORS[item.status].bar}`}
                    style={{ width: `${Math.max(item.share, item.count > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
          <h2 className="text-base font-bold text-slate-900">Nguồn Lead</h2>
          <div className="mt-5 space-y-4">
            {dashboard.sourceBreakdown.length > 0 ? (
              dashboard.sourceBreakdown.slice(0, 4).map((item) => (
                <div key={item.source}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="truncate pr-2 font-medium text-slate-700">
                      {item.source}
                    </span>
                    <span className="text-slate-500 shrink-0">{item.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-400"
                      style={{ width: `${Math.max(item.share, 5)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg">Không có nguồn dữ liệu</p>
            )}
          </div>
        </div>

        {/* Owner Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
          <h2 className="text-base font-bold text-slate-900">Top Owners</h2>
          <div className="mt-5 space-y-3">
            {dashboard.ownerBreakdown.length > 0 ? (
              dashboard.ownerBreakdown.slice(0, 3).map((item, index) => (
                <div
                  key={item.owner}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.owner}</p>
                      <p className="text-xs text-slate-500">
                        Chiếm {formatPercent(item.share)} pipeline
                      </p>
                    </div>
                  </div>
                  <p className="text-base font-bold text-slate-900">{item.count}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg">Chưa phân công</p>
            )}
          </div>
        </div>
      </div>

      {/* Leads Management Area (Filters + Table) */}
      <div className="grid gap-6">
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
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 mb-4">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Không tìm thấy lead nào</h4>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Không có lead nào khớp với bộ lọc hiện tại của bạn. Vui lòng thay đổi từ khóa hoặc xóa bớt các bộ lọc để xem lại danh sách.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200"></div>
            <div className="mt-4 h-4 w-96 animate-pulse rounded bg-slate-100"></div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-lg bg-slate-50"></div>
              ))}
            </div>
          </div>
        </section>
      }
    >
      <LeadsPageContent />
    </Suspense>
  );
}
