import type { ReactNode } from "react";
import { Dumbbell, LogOut} from "lucide-react";

import { useAuth } from "../../../features/auth/AuthContext";

type Props = {
  children: ReactNode;
};

export const AdminLayout = ({ children }: Props) => {
  const { user, logout } = useAuth();

  return (
  <div className="flex min-h-screen bg-background text-white">
    <aside className="flex w-64 flex-col border-r border-border bg-card p-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
            <Dumbbell
              size={22}
              className="text-primary"
            />
          </div>

          <h2 className="text-2xl font-bold">
            FitPlan
          </h2>
        </div>

        
      </div>

      <nav className="mt-12">
        <div className="flex items-center gap-3 rounded-xl bg-primary/15 px-4 py-3 text-sm font-semibold text-primary">
          <Dumbbell size={18} />
          Ćwiczenia
        </div>
      </nav>

      <div className="mt-auto">
        <div className="mb-5 border-t border-border pt-5">
          <p className="text-sm font-semibold">
            {user?.firstName || "Admin"}
          </p>

          <p className="mt-1 text-xs text-muted">
            {user?.email}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted transition hover:bg-surface hover:text-white"
        >
          <LogOut size={18} />
          Wyloguj się
        </button>
      </div>
    </aside>

    <main className="flex-1 p-8">
      {children}
    </main>
  </div>
);
};