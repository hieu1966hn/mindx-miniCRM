import { logout } from "@/app/actions/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Search, Bell, LogOut } from "lucide-react";

export async function Header() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-x-3 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex h-full flex-1 items-center gap-x-3 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="/leads" method="GET">
          <label htmlFor="search-field" className="sr-only">Tìm lead</label>
          <Search className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-slate-400" aria-hidden="true" />
          <input
            id="search-field"
            className="block h-10 w-full rounded-lg border-none bg-slate-100 pl-10 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-0 sm:max-w-sm"
            placeholder="Tìm lead..."
            type="search"
            name="q"
          />
        </form>
      </div>
      
      <div className="flex items-center gap-x-3 sm:gap-x-4 lg:gap-x-6">
        <button type="button" className="-m-2.5 hidden p-2.5 text-slate-400 transition-colors hover:text-slate-500 sm:block">
          <span className="sr-only">Xem thông báo</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>
        
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />
        
        <div className="flex items-center gap-x-2 sm:gap-x-4">
            {user && (
              <span className="hidden text-sm font-medium text-slate-700 lg:block">
              {user.email}
              </span>
            )}
            <form action={logout}>
              <button
                  type="submit"
                  title="Đăng xuất"
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:px-3"
              >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </form>
        </div>
      </div>
    </header>
  );
}
