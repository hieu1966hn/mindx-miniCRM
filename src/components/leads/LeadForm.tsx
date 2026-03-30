"use client";

import { ChangeEvent, FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lead, LeadFormValues } from "@/types/lead";
import { useLeads } from "@/contexts/LeadContext";
import { calculateLeadScore } from "@/utils/leadScoring";
import { describeLeadRouting } from "@/utils/routing";
import { CheckCircle2, AlertCircle, TrendingUp, Info } from "lucide-react";

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
  const defaultValues = useMemo<LeadFormValues>(
    () => initialData ?? initialValues,
    [initialData]
  );
  const [values, setValues] = useState<LeadFormValues>(defaultValues);
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
    if (!values.phone.trim() && !values.email.trim()) nextErrors.phone = "Cần ít nhất số điện thoại hoặc email.";
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
      <form id="lead-create-form" onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tiếp nhận lead</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">Tạo lead mới</h3>
            <p className="mt-2 text-sm text-slate-500">
              Nhập thông tin khách hàng tiềm năng. Hệ thống sẽ tự động chấm điểm và phân bổ.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {progress}/7 trường
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div
            className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-medium">Form chưa thể lưu. Vui lòng kiểm tra lại thông tin.</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-700">
                {Object.values(errors).map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <span className="text-sm font-medium">Lead đã được {initialData ? "cập nhật" : "lưu"} thành công!</span>
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

        <label className="mt-5 block text-sm font-medium text-slate-700">
          <span className="mb-1.5 block">Ghi chú</span>
          <textarea
            id="lead-notes"
            name="notes"
            rows={4}
            value={values.notes}
            onChange={handleChange}
            placeholder="Phụ huynh muốn học thử cuối tuần, quan tâm robotics..."
            className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </label>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            id="lead-submit-button"
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Đang lưu..." : "Lưu dữ liệu"}
          </button>
          <button
            id="lead-reset-button"
            type="button"
            onClick={() => {
              setValues(defaultValues);
              setErrors({});
              setShowSuccess(false);
            }}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Làm mới
          </button>
        </div>
      </form>

      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-900">Thông tin form</h4>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• <span className="font-medium">Họ và tên</span> là thông tin bắt buộc.</li>
            <li>• Cần cung cấp ít nhất <span className="font-medium">Số điện thoại</span> hoặc <span className="font-medium">Email</span> để tạo hồ sơ.</li>
            <li>• Phân bổ owner sẽ tự động tính ngay sau khi lưu.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <h4 className="text-sm font-semibold text-slate-900">Xem trước điểm lead</h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-900">{scorePreview.score}</span>
              <span className="text-sm text-slate-500">/100</span>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${scorePreview.score > 60 ? "bg-emerald-500" : scorePreview.score > 30 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${scorePreview.score}%` }}
            />
          </div>

          <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Dự kiến giao cho</span>
              <span className="font-medium text-slate-900">{routingPreview.owner}</span>
            </div>
            <div className="mt-2 border-t border-slate-200 pt-2 text-xs text-slate-600">
              <div className="mb-1 font-medium text-slate-700">
                {routingPreview.isPriority ? "Luồng ưu tiên" : "Luồng tiêu chuẩn"}
              </div>
              <ul className="space-y-1">
                {routingPreview.reasons.map((reason) => (
                  <li key={reason}>• {reason}</li>
                ))}
              </ul>
            </div>
          </div>

          {scorePreview.scoreFactors.length > 0 && (
            <div className="mt-4 space-y-2">
              <h5 className="text-xs font-medium uppercase tracking-wider text-slate-500">Chi tiết điểm cộng</h5>
              {scorePreview.scoreFactors.map((factor) => (
                <div key={factor.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{factor.label}</span>
                  <span className="font-medium text-emerald-600">+{factor.points}</span>
                </div>
              ))}
            </div>
          )}
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
    <label className="text-sm font-medium text-slate-700">
      <span className="mb-1.5 block">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
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
        className={`w-full rounded-md px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-slate-400 ${
          error
            ? "border border-red-300 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border border-slate-300 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        }`}
      />
      {error ? <span id={`lead-${name}-error`} className="mt-1.5 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
}

function SelectField({ label, name, value, error, required = false, onChange, options }: BaseFieldProps & { options: readonly string[] }) {
  return (
    <label className="text-sm font-medium text-slate-700">
      <span className="mb-1.5 block">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      <select
        id={`lead-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `lead-${name}-error` : undefined}
        className={`w-full rounded-md bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition ${
          error
            ? "border border-red-300 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border border-slate-300 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        }`}
      >
        <option value="">Chọn...</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error ? <span id={`lead-${name}-error`} className="mt-1.5 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
}
