import { Formik } from "formik";

import { onboardingInitialValues } from "../../features/onboarding/constants/onboardingInitialValues";
import { onboardingSchema } from "../../features/onboarding/validation/onboardingSchema";
import type { OnboardingFormValues } from "../../features/onboarding/types/onboarding";
import { experienceLevelOptions,goalOptions } from "../../features/onboarding/constants/onboardingOptions";


import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { FormError } from "../../ui/FormError";
import { Input } from "../../ui/Input";



const OnboardingPage = () => {
  const handleSubmit = (values: OnboardingFormValues) => {
    console.log("Onboarding values:", values);
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
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

        <Card className="border border-white/10 bg-card/90 p-5 shadow-2xl backdrop-blur-md sm:p-8">
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
                  <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Wiek
                  </label>

                  <Input
                    type="number"
                    name="age"
                    placeholder="np. 25"
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
                    placeholder="np. 180"
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
                    placeholder="np. 80"
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

                <Button type="submit" className="mt-2 w-full py-3 text-base font-semibold transition hover:scale-[1.01]">
                  Przejdź dalej
                </Button>
              </form>
              
            )}
          </Formik>
        </Card>
      </div>
    </main>
  );
};

export default OnboardingPage;