"use client";

interface LeadFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sourceFilter: string;
  onSourceChange: (value: string) => void;
  scoreFilter: string;
  onScoreChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
}

const STATUS_OPTIONS = ["New", "Contacting", "Interested", "Converted", "Lost"];
const SOURCE_OPTIONS = ["Website", "Workshop", "Facebook", "Zalo", "Referral"];
const SCORE_OPTIONS = ["hot", "warm", "cold"];

export function LeadFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  scoreFilter,
  onScoreChange,
  sortBy,
  onSortChange,
  onResetFilters,
}: LeadFiltersProps) {
  const activeFilters = [searchTerm, statusFilter, sourceFilter, scoreFilter].filter(Boolean).length;

  return (
    <section className="glass-panel-strong rounded-[30px] p-5 lg:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Pipeline controls</p>
          <h3 className="mt-2 text-2xl text-white">Filter, search và ưu tiên pipeline</h3>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          <span>Active filters</span>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
            {activeFilters}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="relative xl:col-span-2">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            id="lead-search-input"
            type="text"
            placeholder="Tìm tên, sđt, email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-[22px] border border-white/10 bg-white/6 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-300/45 focus:bg-cyan-300/8"
          />
        </div>

        <select
          id="lead-status-filter"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded-[22px] border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none transition duration-300 focus:border-cyan-300/45 focus:bg-cyan-300/8"
        >
          <option value="" className="bg-slate-950">Tất cả trạng thái</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-950">{opt}</option>
          ))}
        </select>

        <select
          id="lead-source-filter"
          value={sourceFilter}
          onChange={(e) => onSourceChange(e.target.value)}
          className="w-full rounded-[22px] border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none transition duration-300 focus:border-cyan-300/45 focus:bg-cyan-300/8"
        >
          <option value="" className="bg-slate-950">Tất cả nguồn</option>
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-950">{opt}</option>
          ))}
        </select>

        <select
          id="lead-score-filter"
          value={scoreFilter}
          onChange={(e) => onScoreChange(e.target.value)}
          className="w-full rounded-[22px] border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none transition duration-300 focus:border-cyan-300/45 focus:bg-cyan-300/8"
        >
          <option value="" className="bg-slate-950">Mọi mức độ</option>
          {SCORE_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-950">{opt.toUpperCase()}</option>
          ))}
        </select>

        <select
          id="lead-sort-filter"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full rounded-[22px] border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none transition duration-300 focus:border-cyan-300/45 focus:bg-cyan-300/8"
        >
          <option value="newest" className="bg-slate-950">Mới nhất</option>
          <option value="oldest" className="bg-slate-950">Cũ nhất</option>
          <option value="score" className="bg-slate-950">Điểm cao nhất</option>
          <option value="name" className="bg-slate-950">Tên A-Z</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400">Search • Status • Source • Temperature • Sort</span>
          {activeFilters > 0 ? (
            <button
              id="reset-lead-filters"
              type="button"
              onClick={onResetFilters}
              className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100 transition duration-300 hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-cyan-100"
            >
              Reset filters
            </button>
          ) : null}
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Signals ready for follow-up</p>
      </div>
    </section>
  );
}
