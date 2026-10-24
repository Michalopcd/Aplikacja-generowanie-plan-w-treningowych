import { Check } from "lucide-react";
import { Link } from "react-router-dom";

import { useDashboardRecentActivity } from "../hooks/useDashboardRecentActivity";

import { DashboardRecentActivityCardSkeleton } from "./DashboardRecentActivityCardSkeleton";

import { goalLabels } from "../../training/constants/trainingLabels";
import { formatISODateToDisplayDate } from "../../training/utils/dateUtils";

import { ROUTES } from "../../../utils/route";

import { Card } from "../../../ui/Card";
import { EmptyState } from "../../../ui/EmptyState";
import { ErrorState } from "../../../ui/ErrorState";

type Props = {
  uid: string;
};

export const DashboardRecentActivityCard = ({ uid }: Props) => {
  const { isLoading, errorMessage, status, activities } =
    useDashboardRecentActivity(uid);

  if (isLoading) {
    return <DashboardRecentActivityCardSkeleton />;
  }

  if (errorMessage) {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">Ostatnia aktywność</p>

        <ErrorState message={errorMessage} />
      </Card>
    );
  }

  if (status === "no-active-plan") {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">Ostatnia aktywność</p>

        <EmptyState
          title="Brak aktywnego planu"
          description="Wygeneruj plan treningowy, aby dashboard mógł pokazywać ostatnio wykonane treningi."
          action={
            <Link
              to={ROUTES.PLAN}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
            >
              Przejdź do planu
            </Link>
          }
        />
      </Card>
    );
  }

  if (status === "empty") {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">Ostatnia aktywność</p>

        <EmptyState
          title="Brak wykonanych treningów"
          description="Oznacz pierwszy trening jako wykonany, aby zobaczyć swoją ostatnią aktywność na dashboardzie."
          action={
            <Link
              to={ROUTES.PLAN}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
            >
              Przejdź do planu
            </Link>
          }
        />
      </Card>
    );
  }

  return (
    <Card className="bg-surface p-6">
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-primary">
            Ostatnia aktywność
          </p>

          <Link
            to={ROUTES.HISTORY}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:px-4"
          >
            Historia
          </Link>
        </div>

        <p className="mt-2 text-xl font-bold">Ostatnio wykonane treningi</p>
      </div>

      <ul className="mt-4 divide-y divide-border">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-center justify-between gap-3 py-4 sm:gap-4"
          >
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <span className="w-20 shrink-0 text-sm font-semibold text-muted">
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
