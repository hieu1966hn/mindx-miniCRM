"use client";

import { use, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/leads/LeadForm";
import { useLeads } from "@/contexts/LeadContext";
import { getLeadTemperature } from "@/utils/leadPriority";
import { OWNER_OPTIONS } from "@/utils/routing";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { leads, updateLead, updateLeadStatus, deleteLead } = useLeads();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [, startTransition] = useTransition();

  const lead = leads.find((item) => item.id === id);
  const ownerOptions = useMemo(() => [...OWNER_OPTIONS], []);

  if (!lead) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <h3 className="text-2xl font-serif text-white">Không tìm thấy lead này</h3>
        <p className="text-slate-400">Có thể lead đã bị xóa hoặc ID không đúng.</p>
        <Link href="/leads" className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-950">
          Về danh sách
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa lead này?")) {
      startTransition(async () => {
        await deleteLead(id);
        router.push("/leads");
      });
    }
  };

  const statusOptions: Array<{ label: string; value: typeof lead.status }> = [
    { label: "Mới (New)", value: "New" },
    { label: "Đang liên hệ", value: "Contacting" },
    { label: "Quan tâm", value: "Interested" },
    { label: "Đã chốt (Win)", value: "Converted" },
    { label: "Tạm dừng (Lost)", value: "Lost" },
  ];
  const scoreTier = getLeadTemperature(lead.score);
  const isManualOwner = lead.routingMode === "manual";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/leads" className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa lead"}
          </button>
          <button
            onClick={handleDelete}
            className="rounded-full border border-rose-500/30 bg-rose-500/10 px-6 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/20"
          >
            Xóa lead
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {isEditing ? (
            <div className="rounded-[30px] border border-white/10 bg-slate-950/40 p-6 lg:p-8">
              <LeadForm
                initialData={lead}
                onSuccess={() => {
                  setTimeout(() => setIsEditing(false), 800);
                }}
              />
            </div>
          ) : (
            <div className="rounded-[30px] border border-white/10 bg-slate-950/40 p-8 shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-4xl font-bold text-slate-950">
                  {lead.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-serif text-4xl text-white">{lead.fullName}</h1>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${scoreTier.badgeClassName}`}>
                      {scoreTier.label} lead
                    </span>
                  </div>
                  <p className="mt-1 text-slate-400">{lead.email} • {lead.phone}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      Owner: {lead.assignedTo}
                    </div>
                    <div className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${
                      isManualOwner
                        ? "border-amber-300/30 bg-amber-300/10 text-amber-100"
                        : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                    }`}>
                      {isManualOwner ? "Manual override" : "Auto-routed"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-slate-500">Thông tin học tập</h4>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Chương trình quan tâm</p>
                      <p className="text-lg text-white">{lead.programInterest}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Cơ sở / Khu vực</p>
                      <p className="text-lg text-white">{lead.campusOrRegion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Nguồn lead</p>
                      <p className="text-lg text-white">{lead.leadSource}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-slate-500">Qualification</h4>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Điểm tiềm năng (Score)</p>
                      <p className="text-lg font-bold text-amber-300">★ {lead.score}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Sale phụ trách</p>
                      <p className="text-lg text-white">{lead.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Nhóm tuổi</p>
                      <p className="text-lg text-white">{lead.ageGroup || "Chưa xác định"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-slate-500">Score breakdown</h4>
                    <p className="mt-2 text-sm text-slate-400">Giải thích vì sao lead này được ưu tiên ở mức hiện tại.</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                    Total {lead.score}/100
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {lead.scoreFactors.map((factor) => (
                    <div key={factor.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">
                      <span className="text-slate-200">{factor.label}</span>
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                        +{factor.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {lead.notes && (
                <div className="mt-10 border-t border-white/5 pt-10">
                  <h4 className="text-xs uppercase tracking-widest text-slate-500">Ghi chú thêm</h4>
                  <p className="mt-4 whitespace-pre-wrap italic leading-relaxed text-slate-300">
                    &quot;{lead.notes}&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-white/10 bg-slate-950/40 p-6 backdrop-blur">
            <h4 className="text-sm font-semibold text-white">Chuyển trạng thái nhanh</h4>
            <div className="mt-4 grid gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    startTransition(async () => {
                      await updateLeadStatus(id, option.value);
                    })
                  }
                  className={`flex items-center justify-between rounded-2xl border px-5 py-3 text-sm transition ${
                    lead.status === option.value
                      ? "border-cyan-300 bg-cyan-300/10 text-cyan-200"
                      : "border-white/5 bg-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10"
                  }`}
                >
                  {option.label}
                  {lead.status === option.value && (
                    <svg className="h-4 w-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-950/40 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Owner routing</h4>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Auto-routing theo score + source + campus. Có thể override thủ công khi owner cần takeover.
                </p>
              </div>
              <button
                onClick={() =>
                  startTransition(async () => {
                    await updateLead(id, {
                      routingMode: isManualOwner ? "auto" : "manual",
                      assignedTo: isManualOwner ? lead.assignedTo : ownerOptions[0],
                    });
                  })
                }
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                  isManualOwner
                    ? "border-amber-300/30 bg-amber-300/10 text-amber-100 hover:bg-amber-300/20"
                    : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20"
                }`}
              >
                {isManualOwner ? "Back to auto" : "Enable manual"}
              </button>
            </div>

            <label htmlFor="lead-owner-select" className="mt-5 block text-xs uppercase tracking-[0.18em] text-slate-500">
              Owner phụ trách
            </label>
            <select
              id="lead-owner-select"
              value={lead.assignedTo}
              disabled={!isManualOwner}
              onChange={(event) =>
                startTransition(async () => {
                  await updateLead(id, {
                    assignedTo: event.target.value,
                    routingMode: "manual",
                  });
                })
              }
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {ownerOptions.map((owner) => (
                <option key={owner} value={owner} className="bg-slate-950 text-white">
                  {owner}
                </option>
              ))}
            </select>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-slate-300">
              <p>
                <span className="font-semibold text-white">Current mode:</span> {isManualOwner ? "Manual override" : "Automatic routing"}
              </p>
              <p className="mt-1 text-slate-400">
                Khi quay lại auto, owner sẽ được tính lại ngay từ routing engine mới.
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-cyan-500/20 bg-cyan-500/5 p-6">
            <h4 className="text-sm font-semibold text-cyan-200">System Logs</h4>
            <p className="mt-2 text-xs italic text-slate-500">
              Đã tạo lúc: {new Date(lead.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
