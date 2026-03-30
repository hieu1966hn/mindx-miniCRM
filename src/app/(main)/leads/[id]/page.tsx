"use client";

import { use, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/leads/LeadForm";
import { useLeads } from "@/contexts/LeadContext";
import { getLeadTemperature } from "@/utils/leadPriority";
import { OWNER_OPTIONS } from "@/utils/routing";
import { ArrowLeft, Edit2, Trash2, CheckCircle2, User, Activity, Clock } from "lucide-react";

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
        <h3 className="text-2xl font-semibold text-slate-900">Không tìm thấy lead này</h3>
        <p className="text-slate-500">Có thể lead đã bị xóa hoặc ID không đúng.</p>
        <Link href="/leads" className="inline-flex items-center justify-center rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200">
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
        <Link href="/leads" className="group flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại danh sách
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            <Edit2 className="h-4 w-4" />
            {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 className="h-4 w-4" />
            Xóa lead
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {isEditing ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <LeadForm
                initialData={lead}
                onSuccess={() => {
                  setTimeout(() => setIsEditing(false), 800);
                }}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-3xl font-bold text-red-700">
                  {lead.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold text-slate-900">{lead.fullName}</h1>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      Lead {scoreTier.label.toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <User className="h-4 w-4" />
                    {lead.email || "Không có email"} • {lead.phone}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                      Phụ trách: {lead.assignedTo}
                    </div>
                    <div className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${
                      isManualOwner
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}>
                      {isManualOwner ? "Gán thủ công" : "Tự động phân bổ"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Thông tin học tập</h4>
                  <div className="mt-4 space-y-5">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Chương trình quan tâm</p>
                      <p className="mt-1 text-base text-slate-900">{lead.programInterest}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Cơ sở / Khu vực</p>
                      <p className="mt-1 text-base text-slate-900">{lead.campusOrRegion}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Nguồn lead</p>
                      <p className="mt-1 text-base text-slate-900">{lead.leadSource}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Đánh giá chất lượng</h4>
                  <div className="mt-4 space-y-5">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Điểm tiềm năng (Score)</p>
                      <div className="mt-1 flex items-center gap-1.5 text-base font-bold text-slate-900">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        {lead.score} điểm
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Sale phụ trách</p>
                      <p className="mt-1 text-base text-slate-900">{lead.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Nhóm tuổi</p>
                      <p className="mt-1 text-base text-slate-900">{lead.ageGroup || "Chưa xác định"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Chi tiết điểm lead</h4>
                    <p className="mt-1 text-sm text-slate-500">Chi tiết cộng điểm dựa trên thông tin thu thập được.</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-900 shadow-sm">
                    Tổng: {lead.score}
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  {lead.scoreFactors.map((factor) => (
                    <div key={factor.label} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-3 shadow-sm">
                      <span className="text-sm text-slate-700">{factor.label}</span>
                      <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        +{factor.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {lead.notes && (
                <div className="mt-10 border-t border-slate-100 pt-8">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ghi chú thêm</h4>
                  <div className="mt-3 rounded-lg bg-yellow-50 p-4">
                    <p className="whitespace-pre-wrap text-sm italic leading-relaxed text-yellow-800">
                      &quot;{lead.notes}&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Chuyển trạng thái nhanh</h4>
            <div className="mt-4 grid gap-2.5">
              {statusOptions.map((option) => {
                const isActive = lead.status === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() =>
                      startTransition(async () => {
                        await updateLeadStatus(id, option.value);
                      })
                    }
                    className={`flex items-center justify-between rounded-md border px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                    {isActive && <CheckCircle2 className="h-4 w-4 text-red-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Phân bổ người phụ trách</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Phân bổ dựa trên thuật toán điểm số và nguồn.
                </p>
              </div>
              <button
                onClick={() =>
                  startTransition(async () => {
                    await updateLead(id, {
                      routingMode: isManualOwner ? "auto" : "manual",
                      assignedTo: lead.assignedTo,
                    });
                  })
                }
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isManualOwner
                    ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isManualOwner ? "Quay lại tự động" : "Bật chỉnh tay"}
              </button>
            </div>

            <label htmlFor="lead-owner-select" className="mt-5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sale phụ trách
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
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            >
              {ownerOptions.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>

            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Chế độ hiện tại:</span> {isManualOwner ? "Gán thủ công" : "Phân bổ tự động"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <h4 className="text-sm font-semibold text-slate-900">Nhật ký hệ thống</h4>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              Tạo lúc: {new Date(lead.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
