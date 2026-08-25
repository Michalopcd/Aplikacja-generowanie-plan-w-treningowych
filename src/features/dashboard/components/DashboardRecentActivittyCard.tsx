import { useNavigate } from "react-router-dom";

import { Button } from "../../../ui/Button";
import { Card } from "../../../ui/Card";
import { goalLabels } from "../../training/constants/trainingLabels";
import { formatISODateToDisplayDate } from "../../training/utils/dateUtils";
import { useDashboardRecentActivity } from "../hooks/useDashboardRecentActivity";

type DashboardRecentActivityCardProps = {
  uid: string;
};

export const DashboardRecentActivityCard = ({
  uid,
}: DashboardRecentActivityCardProps) => {
  const navigate = useNavigate();

  const {
    isLoading,
    errorMessage,
    status,
    activities,
  } = useDashboardRecentActivity(uid);

  if (isLoading) {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">
          Ostatnia aktywność
        </p>

        <p className="mt-3 text-sm text-muted">
          Ładowanie ostatniej aktywności...
        </p>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">
          Ostatnia aktywność
        </p>

        <p className="mt-3 text-sm text-muted">{errorMessage}</p>
      </Card>
    );
  }

  if (status === "no-active-plan") {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">
          Ostatnia aktywność
        </p>

        <h2 className="mt-2 text-xl font-bold">
          Brak aktywnego planu
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted">
          Wygeneruj plan treningowy, aby dashboard mógł pokazywać
          ostatnio wykonane treningi.
        </p>

        <Button
          type="button"
          onClick={() => navigate("/plan")}
          className="mt-5"
        >
          Przejdź do planu
        </Button>
      </Card>
    );
  }

  if (status === "empty") {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">
          Ostatnia aktywność
        </p>

        <h2 className="mt-2 text-xl font-bold">
          Brak wykonanych treningów
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted">
          Oznacz pierwszy trening jako wykonany, aby zobaczyć swoją
          ostatnią aktywność na dashboardzie.
        </p>

        <Button
          type="button"
          onClick={() => navigate("/plan")}
          className="mt-5"
        >
          Przejdź do planu
        </Button>
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

          <h2 className="mt-2 text-xl font-bold">
            Ostatnio wykonane treningi
          </h2>
        </div>

        <Button
          type="button"
          onClick={() => navigate("/history")}
          className="shrink-0"
        >
          Historia
        </Button>
      </div>

      <ul className="mt-5 divide-y divide-border">
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
                <p className="truncate text-sm font-semibold">
                  {activity.workoutDayName}
                </p>

                <p className="mt-1 text-xs text-muted">
                  Tydzień {activity.weekNumber} ·{" "}
                  {activity.exerciseCount} ćwiczeń ·{" "}
                  {goalLabels[activity.goal]}
                </p>
              </div>
            </div>

            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-success/40 bg-success/10 text-sm font-bold text-success">
              ✓
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
};