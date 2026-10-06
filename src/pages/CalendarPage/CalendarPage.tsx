import { useState } from "react";

import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import plLocale from "@fullcalendar/core/locales/pl";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { WorkoutDetailsContent } from "../../features/training/components/WorkoutDetailsContent";
import { useWorkoutCalendar } from "../../features/training/hooks/useWorkoutCalendar";

import type { WorkoutDay } from "../../features/training/trainingPlan";

import { formatDateToISO } from "../../features/training/utils/dateUtils";
import { createWorkoutPlanEvents } from "../../features/training/utils/workoutPlanEvents";

import { ROUTES } from "../../utils/route";

import { Card } from "../../ui/Card";
import { EmptyState } from "../../ui/EmptyState";
import { ErrorState } from "../../ui/ErrorState";
import { LoadingState } from "../../ui/LoadingState";

import "../../features/training/styles/workoutCalendar.css";

const CalendarPage = () => {
  const {
    plan,
    completedWorkoutKeys,
    isLoading,
    errorMessage,
    updateWorkoutDate,
  } = useWorkoutCalendar();

  const [selectedWorkoutDay, setSelectedWorkoutDay] =
    useState<WorkoutDay | null>(null);

  if (isLoading) {
    return <LoadingState message="Ładowanie kalendarza treningów..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (!plan) {
    return (
      <section className="w-full">
        <Card className="mx-auto max-w-md bg-surface p-6">
          <EmptyState
            title="Brak aktywnego planu"
            description="Najpierw wygeneruj plan treningowy w zakładce Mój plan. Po zapisaniu planu kalendarz pokaże treningi w czasie."
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
      </section>
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
      await updateWorkoutDate({
        weekNumber,
        workoutDayNumber: workoutDay.dayNumber,
        scheduledDate: newScheduledDate,
      });

      toast.success("Termin treningu został zmieniony.");
    } catch {
      dropInfo.revert();

      toast.error("Nie udało się zmienić terminu treningu.");
    }
  };

  const handleCloseWorkoutDetails = () => {
    setSelectedWorkoutDay(null);
  };

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary">Kalendarz</p>

        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
          Kalendarz treningów
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
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

                const weekStartDate = draggedEvent.extendedProps.weekStartDate;

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
            <EmptyState
              title="Wybierz trening"
              description="Kliknij trening w kalendarzu, aby zobaczyć jego szczegóły."
            />
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
          to={ROUTES.DASHBOARD}
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-2 font-semibold text-white transition hover:opacity-90 sm:w-auto"
        >
          Wróć do dashboardu
        </Link>
      </div>
    </section>
  );
};

export default CalendarPage;
