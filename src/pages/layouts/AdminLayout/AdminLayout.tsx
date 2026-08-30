import { useState, type ReactNode } from "react";
import {
  Dumbbell,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../../features/auth/AuthContext";

type Props = {
  children: ReactNode;
};

export const AdminLayout = ({
  children,
}: Props) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-white lg:flex">
      <header className="flex items-center justify-between border-b border-border bg-card p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
            <Dumbbell
              size={22}
              className="text-primary"
            />
          </div>

          <span className="text-xl font-bold">
            FitPlan
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 transition hover:bg-surface"
          aria-label="Otwórz menu"
        >
          {isMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </header>

      {isMenuOpen && (
        <div className="border-b border-border bg-card p-4 lg:hidden">
          <nav>
            <div className="flex items-center gap-3 rounded-xl bg-primary/15 px-4 py-3 text-sm font-semibold text-primary">
              <Dumbbell size={18} />
              Ćwiczenia
            </div>
          </nav>

          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm font-semibold">
              {user?.firstName || "Admin"}
            </p>

            <p className="mt-1 text-xs text-muted">
              {user?.email}
            </p>

            <button
              type="button"
              onClick={logout}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted transition hover:bg-surface hover:text-white"
            >
              <LogOut size={18} />
              Wyloguj się
            </button>
          </div>
        </div>
      )}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card p-6 lg:sticky lg:top-0 lg:flex lg:h-screen">
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

        <nav className="mt-12">
          <div className="flex items-center gap-3 rounded-xl bg-primary/15 px-4 py-3 text-sm font-semibold text-primary  hover:bg-red-500/10 hover:text-red-400">
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
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Wyloguj się
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};