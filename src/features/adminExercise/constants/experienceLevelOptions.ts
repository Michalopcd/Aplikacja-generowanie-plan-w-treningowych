import type { ExperienceLevel } from "../../onboarding/types/onboarding";

export const experienceLevelOptions: {
  value: ExperienceLevel;
  label: string;
}[] = [
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