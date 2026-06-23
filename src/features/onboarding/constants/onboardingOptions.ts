import type {
  ExperienceLevel,
  Gender,
  TrainingGoal,
  TrainingLocation,
} from "../types/onboarding";

type Option<T extends string> = {
  value: T;
  label: string;
};

export const experienceLevelOptions: Option<ExperienceLevel>[] = [
  {
    value: "beginner",
    label: "Początkujący",
  },
  {
    value: "intermediate",
    label: "Średniozaawansowany",
  },
  {
    value: "advanced",
    label: "Zaawansowany",
  },
];

export const goalOptions: Option<TrainingGoal>[] = [
  {
    value: "reduction",
    label: "Redukcja",
  },
  {
    value: "recomposition",
    label: "Rekompozycja",
  },
  {
    value: "mass",
    label: "Masa",
  },
];
export const genderOptions: Option<Gender>[] = [
  {
    value: "female",
    label: "Kobieta",
  },
  {
    value: "male",
    label: "Mężczyzna",
  },
  {
    value: "prefer_not_to_say",
    label: "Wolę nie podawać",
  },
];

export const trainingLocationOptions: Option<TrainingLocation>[] = [
  {
    value: "home",
    label: "W domu",
  },
  {
    value: "gym",
    label: "Siłownia",
  },
];
export const trainingDaysOptions: Option<"2" | "3" | "4" | "5">[] = [
  {
    value: "2",
    label: "2 dni w tygodniu",
  },
  {
    value: "3",
    label: "3 dni w tygodniu",
  },
  {
    value: "4",
    label: "4 dni w tygodniu",
  },
  {
    value: "5",
    label: "5 dni w tygodniu",
  },
];
