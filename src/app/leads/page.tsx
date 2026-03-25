"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { useLeads } from "@/contexts/LeadContext";

export default function LeadsPage() {
  const { leads } = useLeads();
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // Search
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(
        (l) =>
          l.fullName.toLowerCase().includes(lowSearch) ||
          l.phone.toLowerCase().includes(lowSearch) ||
          l.email.toLowerCase().includes(lowSearch)
      );
    }

    // Filters
    if (statusFilter) result = result.filter((l) => l.status === statusFilter);
    if (sourceFilter) result = result.filter((l) => l.leadSource === sourceFilter);

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "name") return a.fullName.localeCompare(b.fullName);
      return 0;
    });

    return result;
  }, [leads, searchTerm, statusFilter, sourceFilter, sortBy]);

  return (
    <section className="grid gap-6">
      <div className="rounded-[30px] border border-white/10 bg-slate-950/50 p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Leads board</p>
            <h3 className="mt-3 font-serif text-4xl text-white">Quản lý Lead tinh gọn.</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Vòng 4 hoàn thiện Search, Filter và Sort. Toàn bộ logic filter được xử lý trên client 
              để đảm bảo hiệu năng tối ưu cho người dùng.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link id="leads-back-to-new" href="/leads/new" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200">
              Tạo lead mới
            </Link>
          </div>
        </div>
      </div>

      <LeadFilters 
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        sourceFilter={sourceFilter} onSourceChange={setSourceFilter}
        sortBy={sortBy} onSortChange={setSortBy}
      />

      <LeadTable displayLeads={filteredAndSortedLeads} />

      <div className="rounded-[30px] border border-white/10 bg-white/6 p-7 backdrop-blur-xl lg:px-10">
        <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/75">Vòng 4 • Goals</p>
        <ul className="mt-6 grid gap-4 text-sm leading-7 text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Search theo Info
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Filter Status/Source
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Sort theo Score/Date
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            Real-time update
          </li>
        </ul>
      </div>
    </section>
  );
}
