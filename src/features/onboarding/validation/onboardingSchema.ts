import * as Yup from "yup";

export const onboardingSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "Imię musi mieć minimum 2 znaki.")
    .required("Imię jest wymagane."),
  age: Yup.number()
    .typeError("Wiek musi być liczbą.")
    .min(12, "Minimalny wiek to 12 lat.")
    .max(100, "Maksymalny wiek to 100 lat.")
    .required("Wiek jest wymagany."),

  height: Yup.number()
    .typeError("Wzrost musi być liczbą.")
    .min(100, "Minimalny wzrost to 100 cm.")
    .max(250, "Maksymalny wzrost to 250 cm.")
    .required("Wzrost jest wymagany."),

  weight: Yup.number()
    .typeError("Waga musi być liczbą.")
    .min(30, "Minimalna waga to 30 kg.")
    .max(250, "Maksymalna waga to 250 kg.")
    .required("Waga jest wymagana."),

  experienceLevel: Yup.string()
    .oneOf(
      ["beginner", "intermediate", "advanced"],
      "Wybierz poziom zaawansowania.",
    )
    .required("Poziom zaawansowania jest wymagany."),

  goal: Yup.string()
    .oneOf(["reduction", "recomposition", "mass"], "Wybierz cel treningowy.")
    .required("Cel treningowy jest wymagany."),
  gender: Yup.string()
    .oneOf(["female", "male", "prefer_not_to_say"], "Wybierz płeć.")
    .required("Płeć jest wymagana."),

  trainingLocation: Yup.string()
    .oneOf(["home", "gym"], "Wybierz miejsce treningu.")
    .required("Miejsce treningu jest wymagane."),

  trainingDaysPerWeek: Yup.string()
    .oneOf(["2", "3", "4", "5"], "Wybierz liczbę dni treningowych.")
    .required("Liczba dni treningowych jest wymagana."),
});
