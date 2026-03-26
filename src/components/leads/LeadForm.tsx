"use client";

import { ChangeEvent, FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lead, LeadFormValues } from "@/types/lead";
import { useLeads } from "@/contexts/LeadContext";
import { calculateLeadScore } from "@/utils/leadScoring";
import { describeLeadRouting } from "@/utils/routing";

const AGE_GROUPS = ["Kids", "Teen", "18+"] as const;
const PROGRAMS = ["Scratch", "Web Development", "Data Analytics", "AI/ML", "Robotics"];
const CAMPUSES = ["Ha Noi", "HCM", "Da Nang", "Online"];
const SOURCES = ["Website", "Workshop", "Facebook", "Zalo", "Referral"];

const initialValues: LeadFormValues = {
  fullName: "",
  phone: "",
  email: "",
  ageGroup: "",
  programInterest: "",
  campusOrRegion: "",
  leadSource: "",
  notes: "",
};

interface LeadFormProps {
  initialData?: Lead;
  onSuccess?: () => void;
}

export function LeadForm({ initialData, onSuccess }: LeadFormProps) {
  const router = useRouter();
  const { addLead, updateLead } = useLeads();
  const [values, setValues] = useState<LeadFormValues>(initialData ?? initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const progress = useMemo(
    () => [
      values.fullName,
      values.phone || values.email,
      values.ageGroup,
      values.programInterest,
      values.campusOrRegion,
      values.leadSource,
      values.notes,
    ].filter(Boolean).length,
    [values]
  );
  const scorePreview = useMemo(() => calculateLeadScore(values), [values]);
  const routingPreview = useMemo(
    () => describeLeadRouting({ ...values, score: scorePreview.score }),
    [scorePreview.score, values]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setShowSuccess(false);
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.fullName.trim()) nextErrors.fullName = "Vui lòng nhập họ và tên.";
    if (!values.phone.trim() && !values.email.trim()) nextErrors.phone = "Cần ít nhất phone hoặc email.";
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) nextErrors.email = "Email chưa đúng định dạng.";
    if (!values.ageGroup) nextErrors.ageGroup = "Hãy chọn nhóm tuổi.";
    if (!values.programInterest) nextErrors.programInterest = "Hãy chọn chương trình quan tâm.";
    if (!values.campusOrRegion) nextErrors.campusOrRegion = "Hãy chọn cơ sở hoặc khu vực.";
    if (!values.leadSource) nextErrors.leadSource = "Hãy chọn nguồn lead.";
    return nextErrors;
  };

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);

      const firstErrorField = Object.keys(nextErrors)[0];
      window.requestAnimationFrame(() => {
        const element = document.getElementById(`lead-${firstErrorField}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
          element.focus();
        }
      });
      return;
    }

    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateLead(initialData.id, values);
          setShowSuccess(true);
          setErrors({});
          onSuccess?.();
          setTimeout(() => setShowSuccess(false), 3000);
          return;
        }

        const createdLead = await addLead(values);
        setShowSuccess(true);
        setErrors({});
        onSuccess?.();
        router.push(`/leads?created=${createdLead.id}`);
      } catch (err) {
        setErrors({ submit: "Lưu thất bại. Vui lòng thử lại." });
        console.error(err);
      }
    });
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1.14fr_0.86fr]">
      <form id="lead-create-form" onSubmit={handleSubmit} className="glass-panel-strong liquid-highlight rounded-[32px] p-6 lg:p-7">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Lead intake</p>
            <h3 className="mt-2 text-3xl text-white sm:text-[2.2rem]">Tạo lead với cảm giác như đang dùng CRM thật.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Form này vừa phục vụ nhập dữ liệu, vừa cho xem sớm chất lượng lead và cách hệ thống sẽ route ngay sau khi lưu.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 self-start rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
            {progress}/7 checkpoints
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div
            className="mb-6 rounded-[22px] border border-rose-400/30 bg-rose-500/10 p-4 text-rose-50 shadow-[0_16px_36px_rgba(244,63,94,0.12)]"
            role="alert"
            aria-live="assertive"
          >
            <p className="text-sm font-semibold">Form chưa thể lưu. Vui lòng hoàn thành các trường bắt buộc.</p>
            <ul className="mt-2 space-y-1 text-xs text-rose-100/90">
              {Object.values(errors).map((error) => (
                <li key={error}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {showSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-[22px] border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-100 shadow-[0_16px_36px_rgba(16,185,129,0.12)]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Lead đã được {initialData ? "cập nhật" : "lưu"} thành công!</span>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Họ và tên" name="fullName" value={values.fullName} onChange={handleChange} error={errors.fullName} placeholder="Nguyễn Minh Anh" required />
          <Field label="Số điện thoại" name="phone" value={values.phone} onChange={handleChange} error={errors.phone} placeholder="0901234567" required />
          <Field label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="minhanh@gmail.com" />
          <SelectField label="Nhóm tuổi" name="ageGroup" value={values.ageGroup} onChange={handleChange} error={errors.ageGroup} options={AGE_GROUPS} required />
          <SelectField label="Chương trình" name="programInterest" value={values.programInterest} onChange={handleChange} error={errors.programInterest} options={PROGRAMS} required />
          <SelectField label="Cơ sở / khu vực" name="campusOrRegion" value={values.campusOrRegion} onChange={handleChange} error={errors.campusOrRegion} options={CAMPUSES} required />
          <SelectField label="Nguồn lead" name="leadSource" value={values.leadSource} onChange={handleChange} error={errors.leadSource} options={SOURCES} required />
          <div className="hidden md:block" />
        </div>

        <label className="mt-4 block text-sm text-slate-200">
          <span className="mb-2 block">Ghi chú</span>
          <textarea
            id="lead-notes"
            name="notes"
            rows={5}
            value={values.notes}
            onChange={handleChange}
            placeholder="Phụ huynh muốn học thử cuối tuần, quan tâm robotics..."
            className="w-full rounded-[24px] border border-white/10 bg-white/6 px-4 py-3.5 text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-fuchsia-300/45 focus:bg-fuchsia-300/8"
          />
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            id="lead-submit-button"
            type="submit"
            disabled={isPending}
            className="rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_34px_rgba(34,211,238,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(34,211,238,0.38)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Đang lưu..." : "Lưu lead"}
          </button>
          <button
            id="lead-reset-button"
            type="button"
            onClick={() => {
              setValues(initialValues);
              setErrors({});
            }}
            className="rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm text-slate-100 transition duration-300 hover:border-white/28 hover:bg-white/10"
          >
            Reset form
          </button>
        </div>
      </form>

      <aside className="space-y-4 rounded-[32px]">
        <div className="glass-panel rounded-[28px] p-5 text-sm text-slate-100">
          <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-100/75">Why this feels premium</p>
          <p className="mt-3 leading-7 text-slate-200">
            Giao diện dùng khối tối sâu, lớp kính mờ, spacing thoáng và signal cards để form không còn là một khối nhập liệu phẳng mà trở thành một khu vực ra quyết định.
          </p>
        </div>

        <div className="glass-panel rounded-[28px] p-5 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Validation checklist</p>
          <ul className="mt-4 space-y-3 leading-6">
            <li>• Full name là bắt buộc</li>
            <li>• Cần ít nhất phone hoặc email</li>
            <li>• Email phải đúng format nếu có nhập</li>
            <li>• Age group, program, campus, source là bắt buộc</li>
            <li>• Score và team phụ trách được tính tự động</li>
          </ul>
        </div>

        <div className="glass-panel-strong rounded-[28px] p-5 text-sm text-cyan-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/75">Lead scoring preview</p>
              <p className="mt-3 text-4xl font-semibold text-white">{scorePreview.score}/100</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-slate-950/45 px-3 py-2 text-right">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Assigned</p>
              <p className="mt-1 text-sm text-cyan-100">{routingPreview.owner}</p>
            </div>
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 transition-all duration-500"
              style={{ width: `${scorePreview.score}%` }}
            />
          </div>

          <div className="mt-4 rounded-[22px] border border-white/10 bg-slate-950/35 p-4 text-xs leading-6 text-cyan-50/90">
            <div className="flex items-center justify-between gap-4">
              <span className="uppercase tracking-[0.16em] text-cyan-100/70">Routing mode</span>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  routingPreview.isPriority
                    ? "border-amber-300/30 bg-amber-300/10 text-amber-100"
                    : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                }`}
              >
                {routingPreview.isPriority ? "Priority flow" : "Standard flow"}
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {routingPreview.reasons.map((reason) => (
                <li key={reason}>• {reason}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 space-y-3">
            {scorePreview.scoreFactors.map((factor) => (
              <div
                key={factor.label}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="text-slate-200">{factor.label}</span>
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">
                  +{factor.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}

interface BaseFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

function Field({ label, name, value, error, required = false, onChange, placeholder, type = "text" }: BaseFieldProps & { placeholder: string; type?: string }) {
  return (
    <label className="text-sm text-slate-200">
      <span className="mb-2 block">
        {label}
        {required ? <span className="ml-1 text-rose-300">*</span> : null}
      </span>
      <input
        id={`lead-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `lead-${name}-error` : undefined}
        className={`w-full rounded-[24px] px-4 py-3.5 text-white outline-none transition duration-300 placeholder:text-slate-500 ${
          error
            ? "border border-rose-300/60 bg-rose-500/10 focus:border-rose-300 focus:bg-rose-500/12"
            : "border border-white/10 bg-white/6 focus:border-cyan-300/45 focus:bg-cyan-300/8"
        }`}
      />
      {error ? <span id={`lead-${name}-error`} className="mt-2 block text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}

function SelectField({ label, name, value, error, required = false, onChange, options }: BaseFieldProps & { options: readonly string[] }) {
  return (
    <label className="text-sm text-slate-200">
      <span className="mb-2 block">
        {label}
        {required ? <span className="ml-1 text-rose-300">*</span> : null}
      </span>
      <select
        id={`lead-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `lead-${name}-error` : undefined}
        className={`w-full rounded-[24px] px-4 py-3.5 text-white outline-none transition duration-300 ${
          error
            ? "border border-rose-300/60 bg-rose-500/10 focus:border-rose-300 focus:bg-rose-500/12"
            : "border border-white/10 bg-white/6 focus:border-cyan-300/45 focus:bg-cyan-300/8"
        }`}
      >
        <option value="" className="bg-slate-950">Chọn...</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950">{option}</option>
        ))}
      </select>
      {error ? <span id={`lead-${name}-error`} className="mt-2 block text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
