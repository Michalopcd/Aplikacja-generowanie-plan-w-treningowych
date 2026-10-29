export const formatExerciseCount = (count: number) => {
  if (count === 1) {
    return `${count} ćwiczenie`;
  }

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
  ) {
    return `${count} ćwiczenia`;
  }

  return `${count} ćwiczeń`;
};
