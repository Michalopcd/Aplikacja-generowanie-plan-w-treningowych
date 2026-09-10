import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Card } from "../../../ui/Card";
import { goalLabels } from "../../training/constants/trainingLabels";
import { formatISODateToDisplayDate } from "../../training/utils/dateUtils";
import { useDashboardRecentActivity } from "../hooks/useDashboardRecentActivity";

type Props = {
  uid: string;
};

export const DashboardRecentActivityCard = ({ uid }: Props) => {
  const { isLoading, errorMessage, status, activities } =
    useDashboardRecentActivity(uid);

  if (isLoading) {
    return (
      <Card className="bg-surface p-6">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-primary">
            Ostatnia aktywność
          </p>

          <p className="text-base text-muted">
            Ładowanie ostatniej aktywności...
          </p>
        </div>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card className="bg-surface p-6">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-primary">
            Ostatnia aktywność
          </p>

          <p className="text-base text-muted">
            {errorMessage}
          </p>
        </div>
      </Card>
    );
  }

  if (status === "no-active-plan") {
    return (
      <Card className="bg-surface p-6">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-primary">
            Ostatnia aktywność
          </p>

          <h2 className="text-xl font-bold">
            Brak aktywnego planu
          </h2>

          <p className="text-base leading-6 text-muted">
            Wygeneruj plan treningowy, aby dashboard mógł pokazywać ostatnio
            wykonane treningi.
          </p>

          <div className="flex justify-center lg:justify-start">
            <Link
              to="/plan"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
            >
              Przejdź do planu
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  if (status === "empty") {
    return (
      <Card className="bg-surface p-6">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-primary">
            Ostatnia aktywność
          </p>

          <h2 className="text-xl font-bold">
            Brak wykonanych treningów
          </h2>

          <p className="text-base leading-6 text-muted">
            Oznacz pierwszy trening jako wykonany, aby zobaczyć swoją ostatnią
            aktywność na dashboardzie.
          </p>

          <div className="flex justify-center lg:justify-start">
            <Link
              to="/plan"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
            >
              Przejdź do planu
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">
            Ostatnia aktywność
          </p>

          <h2 className="mt-4 text-xl font-bold">
            Ostatnio wykonane treningi
          </h2>
        </div>

        <Link
          to="/history"
          className="shrink-0 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
        >
          Historia
        </Link>
      </div>

      <ul className="mt-4 divide-y divide-border">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-center justify-between gap-4 py-4"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="w-16 shrink-0 text-sm font-semibold text-muted">
                {formatISODateToDisplayDate(activity.completedDate)}
              </span>

              <div className="min-w-0">
                <p className="truncate text-base font-semibold">
                  {activity.workoutDayName}
                </p>

                <p className="mt-1 text-sm text-muted">
                  Tydzień {activity.weekNumber} · {activity.exerciseCount}{" "}
                  ćwiczeń · {goalLabels[activity.goal]}
                </p>
              </div>
            </div>

            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success">
              <Check size={18} strokeWidth={2.5} />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
};