import { login } from "@/app/actions/auth";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="login-page">
      {/* Background blobs */}
      <div className="login-blob login-blob--cyan" />
      <div className="login-blob login-blob--violet" />
      <div className="login-blob login-blob--sky" />

      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2L26 8V20L14 26L2 20V8L14 2Z"
                stroke="url(#hexGrad)"
                strokeWidth="2"
                fill="rgba(56,189,248,0.12)"
              />
              <defs>
                <linearGradient id="hexGrad" x1="2" y1="2" x2="26" y2="26">
                  <stop stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-title">MindX Mini CRM</h1>
          <p className="login-subtitle">Đăng nhập để quản lý leads</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="login-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error === "Invalid login credentials"
              ? "Email hoặc mật khẩu không đúng"
              : error}
          </div>
        )}

        {/* Form */}
        <form action={login} className="login-form">
          <div className="login-field">
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <div className="login-input-wrapper">
              <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@mindx.edu.vn"
                className="login-input"
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Mật khẩu
            </label>
            <div className="login-input-wrapper">
              <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="login-input"
              />
            </div>
          </div>

          <button type="submit" className="login-btn">
            <span>Đăng nhập</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>

        <p className="login-footer">
          Tài khoản được quản trị viên cấp phát.
        </p>
      </div>
    </div>
  );
}
