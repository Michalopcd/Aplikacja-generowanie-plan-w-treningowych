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
} from "../../features/onboarding/constants/onboardingOptions";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import { saveOnboardingData } from "../../features/auth/profileService";

import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { FormError } from "../../ui/FormError";
import { Input } from "../../ui/Input";

const OnboardingPage = () => {
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (values: OnboardingFormValues) => {
    if (!user) {
      setSubmitError("Nie znaleziono zalogowanego użytkownika.");
      return;
    }
    setSubmitError("");
    try {
      setIsLoading(true);

      const trainingProfile: TrainingProfile = {
        age: Number(values.age),
        height: Number(values.height),
        weight: Number(values.weight),
        experienceLevel:
          values.experienceLevel as TrainingProfile["experienceLevel"],
        goal: values.goal as TrainingProfile["goal"],
      };

      await saveOnboardingData(user.uid, values.firstName, trainingProfile);
      navigate("/dashboard");
    } catch {
      setSubmitError("Nie udało się zapisać danych profilu.");
    } finally {
      setIsLoading(false);
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

          <p className="mt-3 text-sm text-muted">
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
            }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className=" grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
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
                    />

                    {touched.firstName && errors.firstName && (
                      <FormError>{errors.firstName}</FormError>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 mt-2 block text-sm font-medium">
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
                    />

                    {touched.age && errors.age && (
                      <FormError>{errors.age}</FormError>
                    )}
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
                    />

                    {touched.height && errors.height && (
                      <FormError>{errors.height}</FormError>
                    )}
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
                    />

                    {touched.weight && errors.weight && (
                      <FormError>{errors.weight}</FormError>
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
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  >
                    <option value="">Wybierz poziom</option>

                    {experienceLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {touched.experienceLevel && errors.experienceLevel && (
                    <FormError>{errors.experienceLevel}</FormError>
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
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white outline-none focus:border-primary"
                  >
                    <option value="">Wybierz cel</option>

                    {goalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {touched.goal && errors.goal && (
                    <FormError>{errors.goal}</FormError>
                  )}
                </div>

                <Button
                  type="submit"
                  className="mt-2 w-full py-3 text-base font-semibold transition hover:scale-[1.01]"
                >
                  {isLoading ? "Zapisywanie..." : "Przejdź dalej"}
                </Button>
                {submitError && <FormError>{submitError}</FormError>}
              </form>
            )}
          </Formik>
        </Card>
      </div>
    </main>
  );
};

export default OnboardingPage;
