import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utlis/route";
import { logoutUser } from "../../../features/auth/service";

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Nie udało się wylogować użytkownika:", error);
    }
  };
  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">FitPlan</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        <Link
          className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white"
          to={ROUTES.DASHBOARD}
        >
          Przegląd
        </Link>
        <Link
          className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white"
          to={ROUTES.CALENDAR}
        >
          Kalendarz
        </Link>
        <Link
          className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white"
          to={ROUTES.PLAN}
        >
          Mój Plan
        </Link>
        <Link
          className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white"
          to={ROUTES.HISTORY}
        >
          Historia
        </Link>
        <Link
          className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white"
          to={ROUTES.PROGRESS}
        >
          Postępy
        </Link>
        <Link
          className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white"
          to={ROUTES.PROFILE}
        >
          Profil
        </Link>
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-xl px-4 py-3 text-left text-sm text-muted transition hover:bg-surface hover:text-white"
      >
        Wyloguj się
      </button>
    </aside>
  );
}
