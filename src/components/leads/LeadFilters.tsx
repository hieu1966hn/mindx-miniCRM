"use client";

import { ChangeEvent } from "react";
import { Lead } from "@/types/lead";

interface LeadFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sourceFilter: string;
  onSourceChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const STATUS_OPTIONS = ["New", "Contacting", "Interested", "Converted", "Lost"];
const SOURCE_OPTIONS = ["Website", "Workshop", "Facebook", "Zalo", "Referral"];

export function LeadFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  sortBy,
  onSortChange,
}: LeadFiltersProps) {
  return (
    <div className="grid gap-4 rounded-[30px] border border-white/10 bg-slate-950/40 p-4 backdrop-blur md:grid-cols-2 lg:grid-cols-4 lg:p-6">
      <div className="relative">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Tìm tên, sđt, email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-300/50"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
      >
        <option value="" className="bg-slate-950">Tất cả trạng thái</option>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-950">{opt}</option>
        ))}
      </select>

      <select
        value={sourceFilter}
        onChange={(e) => onSourceChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
      >
        <option value="" className="bg-slate-950">Tất cả nguồn</option>
        {SOURCE_OPTIONS.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-950">{opt}</option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
      >
        <option value="newest" className="bg-slate-950">Mới nhất</option>
        <option value="oldest" className="bg-slate-950">Cũ nhất</option>
        <option value="score" className="bg-slate-950">Điểm cao nhất</option>
        <option value="name" className="bg-slate-950">Tên A-Z</option>
      </select>
    </div>
  );
}
