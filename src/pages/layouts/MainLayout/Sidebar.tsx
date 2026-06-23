import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utlis/route";
import { logoutUser } from "../../../features/auth/service";
import { Link } from "../../../ui/Link";
import { Button } from "../../../ui/Button";

import {
  CalendarDays,
  ChartLine,
  ClipboardList,
  History,
  House,
  UserRound,
  LogOut,
  Dumbbell,
} from "lucide-react";

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
    <aside className="flex w-1/6 shrink-0 flex-col border-r border-border bg-card p-2">
      <div className="mb-8 flex items-center gap-2 px-3">
        <Dumbbell className=" shrink-0 text-primary" />

        <h1 className="text-[19px] font-bold leading-none text-white">
          FitPlan
        </h1>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        <Link to={ROUTES.DASHBOARD} icon={House}>
          Przegląd
        </Link>

        <Link to={ROUTES.CALENDAR} icon={CalendarDays}>
          Kalendarz
        </Link>

        <Link to={ROUTES.PLAN} icon={ClipboardList}>
          Mój plan
        </Link>

        <Link to={ROUTES.HISTORY} icon={History}>
          Historia
        </Link>

        <Link to={ROUTES.PROGRESS} icon={ChartLine}>
          Postępy
        </Link>

        <Link to={ROUTES.PROFILE} icon={UserRound}>
          Profil
        </Link>
      </nav>
      <Button
  type="button"
  variant="dangerGhost"
  onClick={handleLogout}
  className="mt-auto flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-normal text-muted"
>
  <LogOut className="h-5 w-5 shrink-0" />
  <span className="whitespace-nowrap">Wyloguj się</span>
</Button>
    </aside>
  );
}
