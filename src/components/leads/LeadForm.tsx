"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { LeadFormValues } from "@/types/lead";
import { useLeads } from "@/contexts/LeadContext";

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

export function LeadForm() {
  const { addLead } = useLeads();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const progress = useMemo(() => Object.values(values).filter(Boolean).length, [values]);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) return setErrors(nextErrors);
    
    addLead(values);
    setShowSuccess(true);
    setValues(initialValues);
    setErrors({});
    
    // Simple alert for now, we can add a toast later
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <form id="lead-create-form" onSubmit={handleSubmit} className="rounded-[30px] border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-cyan-900/10 backdrop-blur">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Lead form</p>
            <h3 className="mt-2 font-serif text-3xl text-white">Tạo một lead thật chỉnh chu</h3>
          </div>
          <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">{progress}/8 fields</div>
        </div>

        {showSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200 animate-in fade-in slide-in-from-top-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Lead đã được lưu vào hệ thống tạm thời (localStorage)!</span>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Họ và tên" name="fullName" value={values.fullName} onChange={handleChange} error={errors.fullName} placeholder="Nguyễn Minh Anh" />
          <Field label="Số điện thoại" name="phone" value={values.phone} onChange={handleChange} error={errors.phone} placeholder="0901234567" />
          <Field label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="minhanh@gmail.com" />
          <SelectField label="Nhóm tuổi" name="ageGroup" value={values.ageGroup} onChange={handleChange} error={errors.ageGroup} options={AGE_GROUPS} />
          <SelectField label="Chương trình" name="programInterest" value={values.programInterest} onChange={handleChange} error={errors.programInterest} options={PROGRAMS} />
          <SelectField label="Cơ sở / khu vực" name="campusOrRegion" value={values.campusOrRegion} onChange={handleChange} error={errors.campusOrRegion} options={CAMPUSES} />
          <SelectField label="Nguồn lead" name="leadSource" value={values.leadSource} onChange={handleChange} error={errors.leadSource} options={SOURCES} />
          <div className="hidden md:block" />
        </div>

        <label className="mt-4 block text-sm text-slate-200">
          <span className="mb-2 block">Ghi chú</span>
          <textarea id="lead-notes" name="notes" rows={5} value={values.notes} onChange={handleChange} placeholder="Phụ huynh muốn học thử cuối tuần, quan tâm robotics..." className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-300/60 focus:bg-white/8" />
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <button id="lead-submit-button" type="submit" className="rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-400/30">Lưu lead tạm thời</button>
          <button id="lead-reset-button" type="button" onClick={() => { setValues(initialValues); setErrors({}); }} className="rounded-full border border-white/12 px-6 py-3 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/6">Reset form</button>
        </div>
      </form>

      <aside className="space-y-4 rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
        <div className="rounded-3xl border border-fuchsia-300/15 bg-fuchsia-300/10 p-5 text-sm text-fuchsia-50">
          <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-200/80">Why this works</p>
          <p className="mt-3 leading-7">UI này tránh kiểu CRM generic bằng cách dùng khối tối sâu, serif headline, glow mảnh và bố cục editorial thay cho dashboard xám quen thuộc.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Validation checklist</p>
          <ul className="mt-4 space-y-3 leading-6">
            <li>• Full name là bắt buộc</li>
            <li>• Cần ít nhất phone hoặc email</li>
            <li>• Email phải đúng format nếu có nhập</li>
            <li>• Age group, program, campus, source là bắt buộc</li>
            <li>• Submit thành công sẽ reset form và log data</li>
          </ul>
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
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

function Field({ label, name, value, error, onChange, placeholder, type = "text" }: BaseFieldProps & { placeholder: string; type?: string }) {
  return (
    <label className="text-sm text-slate-200">
      <span className="mb-2 block">{label}</span>
      <input id={`lead-${name}`} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:bg-white/8" />
      {error ? <span className="mt-2 block text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}

function SelectField({ label, name, value, error, onChange, options }: BaseFieldProps & { options: readonly string[] }) {
  return (
    <label className="text-sm text-slate-200">
      <span className="mb-2 block">{label}</span>
      <select id={`lead-${name}`} name={name} value={value} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/8">
        <option value="" className="bg-slate-950">Chọn...</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950">{option}</option>
        ))}
      </select>
      {error ? <span className="mt-2 block text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
