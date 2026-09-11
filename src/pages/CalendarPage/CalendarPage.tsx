import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import plLocale from "@fullcalendar/core/locales/pl";
import type { EventClickArg } from "@fullcalendar/core";
import { WorkoutDetailsContent } from "../../features/dashboard/components/WorkoutDetailsContent";

import { useAuth } from "../../features/auth/AuthContext";

import {
  ActiveWorkoutPlanNotFoundError,
  getActiveWorkoutPlan,
} from "../../features/training/service/workoutPlanService";

import { createWorkoutPlanEvents } from "../../features/training/utils/workoutPlanEvents";

import type {
  WorkoutDay,
  WorkoutPlan,
} from "../../features/training/trainingPlan";

import { Card } from "../../ui/Card";

import "../../features/training/styles/workoutCalendar.css";

const CalendarPage = () => {
  const { user, isLoading } = useAuth();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  const [selectedWorkoutDay, setSelectedWorkoutDay] =
    useState<WorkoutDay | null>(null);

  const [isPlanLoading, setIsPlanLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadActiveWorkoutPlan = async () => {
      if (!user?.uid) {
        setIsPlanLoading(false);
        return;
      }

      setIsPlanLoading(true);
      setErrorMessage("");

      try {
        const activePlan = await getActiveWorkoutPlan(user.uid);

        setPlan(activePlan);
      } catch (error) {
        if (error instanceof ActiveWorkoutPlanNotFoundError) {
          setPlan(null);
          return;
        }

        setErrorMessage("Nie udało się pobrać kalendarza treningów.");
      } finally {
        setIsPlanLoading(false);
      }
    };

    loadActiveWorkoutPlan();
  }, [user?.uid]);

  if (isLoading || isPlanLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card text-white">
        Ładowanie...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card px-4 text-center text-white">
        {errorMessage}
      </div>
    );
  }

  if (!plan) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-card p-4 text-white">
        <Card className="max-w-md bg-surface text-center">
          <h1 className="text-xl font-bold">Brak aktywnego planu</h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Najpierw wygeneruj plan treningowy w zakładce Mój plan. Po zapisaniu
            planu kalendarz pokaże treningi w czasie.
          </p>

          <Link
            to="/plan"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 font-semibold text-white transition hover:opacity-90"
          >
            Przejdź do planu
          </Link>
        </Card>
      </main>
    );
  }

  const calendarEvents = createWorkoutPlanEvents(plan);

  const handleEventClick = (eventInfo: EventClickArg) => {
    const workoutDay = eventInfo.event.extendedProps.workoutDay as WorkoutDay;

    setSelectedWorkoutDay(workoutDay);
  };

  return (
    <main className="min-h-screen bg-card p-4 text-white md:p-6 xl:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">
            Kalendarz treningów
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
            Aktywny plan treningowy rozpisany na {plan.durationWeeks} tygodni.
            Kliknij trening w kalendarzu, aby zobaczyć szczegóły jednostki.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="overflow-hidden bg-surface p-4 md:p-6 xl:col-span-2">
            <div className="training-calendar">
              <FullCalendar
                plugins={[dayGridPlugin]}
                locale={plLocale}
                firstDay={1}
                initialDate={plan.startDate}
                initialView="dayGridMonth"
                events={calendarEvents}
                height="auto"
                fixedWeekCount={false}
                showNonCurrentDates={true}
                dayMaxEvents={false}
                eventClick={handleEventClick}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "",
                }}
                buttonText={{
                  today: "Dzisiaj",
                }}
              />
            </div>
          </Card>

          <Card className="hidden bg-surface p-6 lg:block">
            {selectedWorkoutDay ? (
              <WorkoutDetailsContent workoutDay={selectedWorkoutDay} />
            ) : (
              <p className="text-center text-sm leading-6 text-muted">
                Wybierz trening w kalendarzu, aby zobaczyć jego szczegóły.
              </p>
            )}
          </Card>
        </div>

        {selectedWorkoutDay && (
          <>
            <button
              type="button"
              aria-label="Zamknij szczegóły treningu"
              onClick={() => setSelectedWorkoutDay(null)}
              className="fixed inset-0 z-40 bg-black/60 xl:hidden"
            />

            <div className="fixed inset-x-0 bottom-0 z-50 max-h-screen overflow-y-auto rounded-t-2xl border border-border bg-surface p-6 xl:hidden">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedWorkoutDay(null)}
                  aria-label="Zamknij"
                  className="rounded-lg p-2 text-muted transition cursor-pointer hover:bg-card hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <WorkoutDetailsContent workoutDay={selectedWorkoutDay} />
            </div>
          </>
        )}
        <div className="mt-8 flex justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 font-semibold text-white transition hover:opacity-90"
          >
            Wróć do dashboardu
          </Link>
        </div>
      </div>
    </main>
  );
};

export default CalendarPage;
