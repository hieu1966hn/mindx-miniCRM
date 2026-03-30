"use client";

import { Search, X } from "lucide-react";

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
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 lg:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Bộ Lọc & Tìm Kiếm</h3>
          <p className="mt-1 text-sm text-slate-500">
            Tìm kiếm lead, lọc theo trạng thái, nguồn, nhiệt độ, hoặc thay đổi thứ tự sắp xếp
          </p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          <span className="font-medium">Đang lọc</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
            {activeFilters}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="relative xl:col-span-2">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            id="lead-search-input"
            type="text"
            placeholder="Tìm tên, SĐT, email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        <select
          id="lead-status-filter"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l4%204%204-4%22%20%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center]"
        >
          <option value="">Tất cả trạng thái</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <select
          id="lead-source-filter"
          value={sourceFilter}
          onChange={(e) => onSourceChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l4%204%204-4%22%20%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center]"
        >
          <option value="">Tất cả nguồn</option>
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <select
          id="lead-score-filter"
          value={scoreFilter}
          onChange={(e) => onScoreChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l4%204%204-4%22%20%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center]"
        >
          <option value="">Tất cả nhiệt độ</option>
          <option value="hot">Nóng</option>
          <option value="warm">Ấm</option>
          <option value="cold">Lạnh</option>
        </select>

        <select
          id="lead-sort-filter"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l4%204%204-4%22%20%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] md:col-span-2 xl:col-span-1"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="score">Điểm cao nhất</option>
          <option value="name">Tên A-Z</option>
        </select>
      </div>

      {activeFilters > 0 && (
        <div className="mt-5 flex justify-end">
          <button
            id="reset-lead-filters"
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition duration-200 hover:text-slate-900"
          >
            <X size={16} />
            Xóa bộ lọc
          </button>
        </div>
      )}
    </section>
  );
}
