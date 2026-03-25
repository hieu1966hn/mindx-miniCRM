export function Header() {
  return (
    <header className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.32em] text-fuchsia-200/70">Vòng 1 • Setup + Lead Form</p>
        <h2 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
          Thu lead nhanh, nhìn là muốn dùng.
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
          Mục tiêu vòng này là dựng khung app, tạo form nhập lead có validation cơ bản và trải nghiệm đủ premium để học viên thấy rõ chất lượng sản phẩm ngay từ bước đầu.
        </p>
      </div>

      <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Flow</p>
          <p className="mt-2 text-lg text-white">Form → Log</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Validation</p>
          <p className="mt-2 text-lg text-white">Client-side</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Style</p>
          <p className="mt-2 text-lg text-white">Tailwind v4</p>
        </div>
      </div>
    </header>
  );
}
