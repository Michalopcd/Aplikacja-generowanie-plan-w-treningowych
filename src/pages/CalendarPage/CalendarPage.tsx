import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";

import { useAuth } from "../../features/auth/AuthContext";
import { WorkoutDetailsContent } from "../../features/training/components/WorkoutDetailsContent";
import { getCompletedWorkoutsForPlan } from "../../features/training/service/completedWorkoutService";

import {
  ActiveWorkoutPlanNotFoundError,
  getActiveWorkoutPlan,
  updateWorkoutScheduleOverride,
} from "../../features/training/service/workoutPlanService";

import type {
  WorkoutDay,
  WorkoutPlan,
} from "../../features/training/trainingPlan";

import { formatDateToISO } from "../../features/training/utils/dateUtils";
import { createWorkoutKey } from "../../features/training/utils/workoutKey";
import { createWorkoutPlanEvents } from "../../features/training/utils/workoutPlanEvents";

import { Card } from "../../ui/Card";

import "../../features/training/styles/workoutCalendar.css";

const CalendarPage = () => {
  const { user, isLoading } = useAuth();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  const [selectedWorkoutDay, setSelectedWorkoutDay] =
    useState<WorkoutDay | null>(null);

  const [completedWorkoutKeys, setCompletedWorkoutKeys] = useState<Set<string>>(
    new Set(),
  );

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

        if (!activePlan) {
          setPlan(null);
          setCompletedWorkoutKeys(new Set());
          return;
        }

        const completedWorkouts = await getCompletedWorkoutsForPlan(
          user.uid,
          activePlan.id,
        );

        const completedKeys = new Set(
          completedWorkouts.map((completedWorkout) =>
            createWorkoutKey(
              completedWorkout.scheduledDate,
              completedWorkout.workoutDayNumber,
            ),
          ),
        );

        setCompletedWorkoutKeys(completedKeys);
        setPlan(activePlan);
      } catch (error) {
        if (error instanceof ActiveWorkoutPlanNotFoundError) {
          setPlan(null);
          setCompletedWorkoutKeys(new Set());
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

  const calendarEvents = createWorkoutPlanEvents(plan, completedWorkoutKeys);

  const today = formatDateToISO(new Date());

  const handleEventClick = (eventInfo: EventClickArg) => {
    const workoutDay = eventInfo.event.extendedProps.workoutDay as WorkoutDay;

    setSelectedWorkoutDay(workoutDay);
  };

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    const { workoutDay, weekNumber, scheduledDate } = dropInfo.event
      .extendedProps as {
      workoutDay: WorkoutDay;
      weekNumber: number;
      scheduledDate: string;
    };

    const newScheduledDate = dropInfo.event.startStr.slice(0, 10);

    if (newScheduledDate === scheduledDate) {
      return;
    }

    try {
      const updatedPlan = await updateWorkoutScheduleOverride({
        plan,
        weekNumber,
        workoutDayNumber: workoutDay.dayNumber,
        scheduledDate: newScheduledDate,
      });

      setPlan(updatedPlan);

      toast.success("Termin treningu został zmieniony.");
    } catch (error) {
      console.error(error);

      dropInfo.revert();

      toast.error("Nie udało się zmienić terminu treningu.");
    }
  };

  const handleCloseWorkoutDetails = () => {
    setSelectedWorkoutDay(null);
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
                plugins={[dayGridPlugin, interactionPlugin]}
                locale={plLocale}
                firstDay={1}
                initialDate={plan.startDate}
                initialView="dayGridMonth"
                events={calendarEvents}
                height="auto"
                fixedWeekCount={false}
                showNonCurrentDates={true}
                dayMaxEvents={false}
                eventStartEditable={true}
                eventDurationEditable={false}
                eventLongPressDelay={400}
                eventAllow={(dropInfo, draggedEvent) => {
                  if (!draggedEvent) {
                    return false;
                  }

                  const isCompleted = draggedEvent.extendedProps.isCompleted;

                  if (isCompleted) {
                    return false;
                  }

                  const weekStartDate =
                    draggedEvent.extendedProps.weekStartDate;

                  const weekEndDate = draggedEvent.extendedProps.weekEndDate;

                  const newDate = dropInfo.startStr.slice(0, 10);

                  const isInSameWeek =
                    newDate >= weekStartDate && newDate <= weekEndDate;

                  const isTodayOrFuture = newDate >= today;

                  return isInSameWeek && isTodayOrFuture;
                }}
                eventDrop={handleEventDrop}
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

          <Card className="hidden bg-surface p-6 xl:block">
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
              onClick={handleCloseWorkoutDetails}
              className="fixed inset-0 z-40 bg-black/60 xl:hidden"
            />

            <div className="fixed inset-x-0 bottom-0 z-50 max-h-screen overflow-y-auto rounded-t-2xl border border-border bg-surface p-6 xl:hidden">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseWorkoutDetails}
                  aria-label="Zamknij"
                  className="cursor-pointer rounded-lg p-2 text-muted transition hover:bg-card hover:text-white"
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
