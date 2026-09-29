import { Formik } from "formik";

import { onboardingInitialValues } from "../../features/onboarding/constants/onboardingInitialValues";
import { onboardingSchema } from "../../features/onboarding/validation/onboardingSchema";
import type {
  OnboardingFormValues,
  TrainingProfile,
} from "../../features/onboarding/types/onboarding";
import {
  experienceLevelOptions,
  goalOptions,
  genderOptions,
  trainingDaysOptions,
  trainingLocationOptions,
} from "../../features/onboarding/constants/onboardingOptions";

type OnboardingFormStatus = "idle" | "error";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import { saveOnboardingData } from "../../features/auth/profileService";

import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";

const OnboardingPage = () => {
  const [status, setStatus] = useState<OnboardingFormStatus>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (values: OnboardingFormValues) => {
    setStatus("idle");
    setFeedbackMessage("");
    if (!user) {
      setStatus("error");
      setFeedbackMessage("Nie znaleziono zalogowanego użytkownika.");
      return;
    }

    try {
      const trainingProfile: TrainingProfile = {
        age: Number(values.age),
        height: Number(values.height),
        weight: Number(values.weight),
        gender: values.gender as TrainingProfile["gender"],
        trainingLocation:
          values.trainingLocation as TrainingProfile["trainingLocation"],
        trainingDaysPerWeek: Number(values.trainingDaysPerWeek),
        experienceLevel:
          values.experienceLevel as TrainingProfile["experienceLevel"],
        goal: values.goal as TrainingProfile["goal"],
      };

      await saveOnboardingData(user.uid, values.firstName, trainingProfile);

      navigate("/dashboard");
    } catch {
      setStatus("error");
      setFeedbackMessage("Nie udało się zapisać danych profilu.");
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-white lg:px-10 lg:py-16">
      <div className="mx-auto max-w-3xl lg:max-w-4xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xl font-semibold text-primary md:text-2xl ">
            Konfiguracja profilu
          </p>

          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            Dopasujmy plan treningowy do Ciebie
          </h1>

          <p className="mt-3 text-sm text-zinc-300">
            Uzupełnij podstawowe dane, aby w kolejnym kroku wygenerować plan
            dopasowany do Twojego celu.
          </p>
        </div>

        <Card className="border border-white/10 bg-card/90 p-5 shadow-2xl backdrop-blur-md sm:p-8 lg:p-10">
          <Formik
            initialValues={onboardingInitialValues}
            validationSchema={onboardingSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className=" grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium ">
                      Imię
                    </label>

                    <Input
                      type="text"
                      name="firstName"
                      placeholder="Podaj imię"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full"
                      error={touched.firstName ? errors.firstName : undefined}
                    />
                  </div>
                  <div>
                    <label className="mb-2  block text-sm font-medium">
                      Wiek
                    </label>

                    <Input
                      type="number"
                      name="age"
                      placeholder="Podaj wiek"
                      value={values.age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full"
                      error={touched.age ? errors.age : undefined}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Wzrost / cm
                    </label>

                    <Input
                      type="number"
                      name="height"
                      placeholder="Podaj wzrost"
                      value={values.height}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full"
                      error={touched.height ? errors.height : undefined}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Waga / kg
                    </label>

                    <Input
                      type="number"
                      name="weight"
                      placeholder="Podaj wage"
                      value={values.weight}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full"
                      error={touched.weight ? errors.weight : undefined}
                    />
                  </div>
                </div>
                <div className="grid  gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Płeć
                    </label>
                    <select
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-white outline-none transition ${
                        touched.gender && errors.gender
                          ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                    >
                      <option value="" disabled>
                        Wybierz płeć
                      </option>

                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {touched.gender && errors.gender && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Gdzie będziesz trenować?
                    </label>

                    <select
                      name="trainingLocation"
                      value={values.trainingLocation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-white outline-none transition ${
                        touched.trainingLocation && errors.trainingLocation
                          ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                    >
                      <option value="" disabled>
                        Wybierz miejsce
                      </option>

                      {trainingLocationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {touched.trainingLocation && errors.trainingLocation && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.trainingLocation}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Ile dni w tygodniu chcesz trenować?
                    </label>

                    <select
                      name="trainingDaysPerWeek"
                      value={values.trainingDaysPerWeek}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-white outline-none transition ${
                        touched.trainingDaysPerWeek &&
                        errors.trainingDaysPerWeek
                          ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                    >
                      <option value="" disabled>
                        Wybierz liczbę dni
                      </option>

                      {trainingDaysOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {touched.trainingDaysPerWeek &&
                      errors.trainingDaysPerWeek && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.trainingDaysPerWeek}
                        </p>
                      )}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Poziom zaawansowania
                  </label>

                  <select
                    name="experienceLevel"
                    value={values.experienceLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-white outline-none transition ${
                      touched.experienceLevel && errors.experienceLevel
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  >
                    <option value="" disabled>
                      Wybierz poziom
                    </option>

                    {experienceLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {touched.experienceLevel && errors.experienceLevel && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.experienceLevel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Cel treningowy
                  </label>

                  <select
                    name="goal"
                    value={values.goal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-white outline-none transition ${
                      touched.goal && errors.goal
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  >
                    <option value="" disabled>
                      Wybierz cel
                    </option>

                    {goalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {touched.goal && errors.goal && (
                    <p className="mt-1 text-xs text-red-400">{errors.goal}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="mt-2 w-full py-3 text-base font-semibold transition hover:scale-[1.01]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Zapisywanie..." : "Przejdź dalej"}
                </Button>
                {status === "error" && (
                  <p className="mt-4 text-sm text-red-400">{feedbackMessage}</p>
                )}
              </form>
            )}
          </Formik>
        </Card>
      </div>
    </main>
  );
};

export default OnboardingPage;
