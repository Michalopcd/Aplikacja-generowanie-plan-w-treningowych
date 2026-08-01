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