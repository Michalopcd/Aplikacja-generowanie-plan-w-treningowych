import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import plLocale from "@fullcalendar/core/locales/pl";
import type { EventClickArg } from "@fullcalendar/core";

import { useAuth } from "../../features/auth/AuthContext";
import { getActiveWorkoutPlan } from "../../features/training/service/workoutPlanService";
import { createWorkoutPlanEvents } from "../../features/training/utils/workoutPlanEvents";
import type {
  MuscleGroup,
  WorkoutDay,
  WorkoutPlan,
} from "../../features/training/trainingPlan";

import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import "../..//features/training/styles/workoutCalendra.css"

const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: "Klatka",
  back: "Plecy",
  shoulders: "Barki",
  biceps: "Biceps",
  triceps: "Triceps",
  quadriceps: "Czworogłowe uda",
  hamstrings: "Dwugłowe uda",
  glutes: "Pośladki",
  calves: "Łydki",
  core: "Brzuch",
};

const getMuscleGroupNames = (muscleGroups: MuscleGroup[]): string => {
  return muscleGroups
    .map((muscleGroup) => muscleGroupLabels[muscleGroup])
    .join(", ");
};

const CalendarPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [selectedWorkoutDay, setSelectedWorkoutDay] =
    useState<WorkoutDay | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const loadActiveWorkoutPlan = async () => {
      if (!user?.uid) {
        setIsPlanLoading(false);
        return;
      }

      setIsPlanLoading(true);
      setErrorMessage("");

      try {
        const activePlan = await getActiveWorkoutPlan(user.uid);

        if (isCancelled) {
          return;
        }

        setPlan(activePlan);
      } catch {
        if (!isCancelled) {
          setErrorMessage("Nie udało się pobrać kalendarza treningów.");
        }
      } finally {
        if (!isCancelled) {
          setIsPlanLoading(false);
        }
      }
    };

    loadActiveWorkoutPlan();

    return () => {
      isCancelled = true;
    };
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
          <h1 className="text-xl font-bold">
            Brak aktywnego planu
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Najpierw wygeneruj plan treningowy w zakładce Mój plan.
            Po zapisaniu planu kalendarz pokaże treningi w czasie.
          </p>

          <Button
            type="button"
            onClick={() => navigate("/plan")}
            className="mt-5 px-6 py-2 font-semibold"
          >
            Przejdź do planu
          </Button>
        </Card>
      </main>
    );
  }

  const calendarEvents = createWorkoutPlanEvents(plan);

  const handleEventClick = (eventInfo: EventClickArg) => {
    const workoutDay = eventInfo.event.extendedProps
      .workoutDay as WorkoutDay;

    setSelectedWorkoutDay(workoutDay);
  };

  return (
    <main className="min-h-screen bg-card p-4 text-white md:p-6 xl:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">
            Kalendarz treningów
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Aktywny plan treningowy rozpisany na {plan.durationWeeks} tygodni.
            Kliknij trening w kalendarzu, aby zobaczyć szczegóły jednostki.
          </p>
        </div>

        <Card className="overflow-hidden bg-surface p-3  sm:p-4 md:p-6">
          <div className="training-calendar">
            <FullCalendar
              plugins={[dayGridPlugin, multiMonthPlugin]}
              locale={plLocale}
              firstDay={1}
              initialDate={plan.startDate}
              initialView="multiMonthThreeMonths"
              events={calendarEvents}
              height="auto"
              fixedWeekCount={true}
              showNonCurrentDates={true}
              dayMaxEvents={false}
              multiMonthMaxColumns={1}
              multiMonthMinWidth={280}
              eventClick={handleEventClick}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "multiMonthThreeMonths,dayGridMonth",
              }}
              buttonText={{
                today: "Dzisiaj",
                month: "Miesiąc",
              }}
              views={{
                multiMonthThreeMonths: {
                  type: "multiMonth",
                  duration: { months: 3 },
                  buttonText: "3 miesiące",
                },
              }}
            />
          </div>
        </Card>

        {selectedWorkoutDay && (
          <Card className="mt-6 bg-surface p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Szczegóły treningu
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedWorkoutDay.name}
                </h2>
              </div>

              <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {selectedWorkoutDay.exercises.length} ćwiczeń
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted">
              Partie:{" "}
              {getMuscleGroupNames(
                selectedWorkoutDay.focusMuscleGroups,
              )}
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {selectedWorkoutDay.exercises.map(
                ({ exercise, sets, repsRange }) => (
                  <div
                    key={exercise.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <p className="font-semibold">{exercise.name}</p>

                    <p className="mt-1 text-xs text-muted">
                      {getMuscleGroupNames(exercise.muscleGroups)}
                    </p>

                    <p className="mt-3 text-sm font-semibold text-primary">
                      {sets} serie x {repsRange.min}-{repsRange.max} powt.
                    </p>
                  </div>
                ),
              )}
            </div>
          </Card>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 font-semibold"
          >
            Wróć do dashboardu
          </Button>
        </div>
      </div>
    </main>
  );
};

export default CalendarPage;