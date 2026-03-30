import { login } from "@/app/actions/auth";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 -m-32 w-96 h-96 rounded-full bg-red-50/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl border border-red-100 mb-4 shadow-sm">
            <span className="font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">MindX Mini CRM</h1>
          <p className="text-sm text-slate-500 mt-2">Đăng nhập để quản lý pipeline</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p>
              {error === "Invalid login credentials"
                ? "Email hoặc mật khẩu không đúng. Vui lòng thử lại."
                : error}
            </p>
          </div>
        )}

        <form action={login} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="w-5 h-5 text-slate-400" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@mindx.edu.vn"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-shadow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="w-5 h-5 text-slate-400" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-shadow"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 mt-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            Đăng nhập
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500 font-medium">
          Hệ thống nội bộ. Tài khoản được cấp phát bởi quản trị viên.
        </p>
      </div>
    </div>
  );
}

