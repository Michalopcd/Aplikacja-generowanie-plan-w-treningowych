import type { WeekDay } from "../trainingPlan"
export const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getMondayOfWeek = (date: Date): Date => {
  const monday = new Date(date);
  const currentDay = monday.getDay();

  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;

  monday.setDate(monday.getDate() + daysToMonday);
  monday.setHours(0, 0, 0, 0);

  return monday;
};
export const formatISODateToDisplayDate = (date: string): string => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("pl-PL");
};


const dayNumberToWeekDay: Record<number, WeekDay> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export const getWeekDayFromISODate = (
  date: string,
): WeekDay => {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  const parsedDate = new Date(
    year,
    month - 1,
    day,
  );

  return dayNumberToWeekDay[
    parsedDate.getDay()
  ];
};