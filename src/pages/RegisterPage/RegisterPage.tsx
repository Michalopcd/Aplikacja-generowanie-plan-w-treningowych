import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { registerSchema } from "../../features/auth/validation/registerSchema";
import type { RegisterFormValues } from "../../features/auth/types/register";
import { getAuthErrorMessage } from "../../features/auth/errors/authErrors";
import { useAuth } from "../../features/auth/AuthContext";
import {  toast } from "react-toastify";

import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { PasswordInput } from "../../ui/PasswordInput";
import { FormError } from "../../ui/FormError";
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout";
import registerBg from "../../assets/registerBg.jpg";

import { Dumbbell, TrendingUp, History } from "lucide-react";
import { registerInitalValues } from "../../features/auth/constants/registerInitialValues";

type RegisterFormStatus = "idle" | "success" | "error";

const RegisterPage = () => {
  const [status, setStatus] = useState<RegisterFormStatus>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const navigate = useNavigate();
  const { register} = useAuth();

  const handleRegister = async (values: RegisterFormValues) => {
    setStatus("idle");
    setFeedbackMessage("");

    try {
      await register(values.email, values.password);
  setStatus("success");

  toast.success("Konto zostało utworzone.", {
    toastId: "register-success",
  });

  navigate("/onboarding", { replace: true });
    } catch (error: unknown) {
      setStatus("error");
      setFeedbackMessage(
        getAuthErrorMessage(error, "Nie udało się utworzyć konta."),
      );
    }
  };
  const registerHero = (
  <>
    <div className="max-w-xl">
      <p className="mb-7 w-fit rounded-full bg-success/10 px-4 py-1.5 text-sm font-semibold text-success">
        Zacznij już dziś
      </p>

      <h2 className="text-3xl font-bold leading-tight lg:text-4xl xl:text-5xl">
        Zacznij budować swój{" "}
        <span className="text-success">
          plan treningowy.
        </span>
      </h2>

      <p className="mt-5 text-base leading-7 text-muted">
        Stwórz konto i otrzymuj spersonalizowane plany dopasowane do Twoich
        celów.
      </p>

      <div className="mt-8 space-y-4">
        <Card className="p-4 lg:p-5">
          <div className="flex items-center gap-5">
            <Dumbbell className="h-7 w-7 shrink-0 text-orange-400" />

            <div>
              <p className="text-base font-semibold text-orange-400">
                Personalizowane plany
              </p>

              <p className="mt-1 text-sm text-muted">
                Treningi dopasowane do Twoich celów.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-5">
          <div className="flex items-center gap-5">
            <TrendingUp className="h-7 w-7 shrink-0 text-success" />

            <div>
              <h3 className="text-base font-semibold text-success">
                Śledzenie postępów
              </h3>

              <p className="mt-1 text-sm text-muted">
                Monitoruj swoją aktywność i progres.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-5">
          <div className="flex items-center gap-5">
            <History className="h-7 w-7 shrink-0 text-primary" />

            <div>
              <h3 className="text-base font-semibold text-primary">
                Historia treningów
              </h3>

              <p className="mt-1 text-sm text-muted">
                Wracaj do wykonanych treningów i wyników.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </>
);

  return (
    <AuthLayout hero={registerHero} heroImage={registerBg} heroPosition="left">
      <Card className="w-full bg-auth-card p-7 shadow-2xl sm:p-8 lg:p-10 xl:p-12">
      <div className="mb-8">
        <h1 className="text-center text-3xl font-bold lg:text-4xl">Zarejestruj się</h1>
        <p className="mt-2 text-center text-base text-muted">
          Utwórz konto i zacznij trenować mądrzej
        </p>
      </div>

      <Formik
        initialValues={registerInitalValues}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
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
            <Input
              className="w-full px-4 py-3 text-base"
              type="email"
              name="email"
              placeholder="E-mail"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {touched.email && errors.email && (
              <FormError>{errors.email}</FormError>
            )}

            <PasswordInput
              className="px-4 py-3 text-base"
              name="password"
              placeholder="Hasło"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {touched.password && errors.password && (
              <FormError>{errors.password}</FormError>
            )}

            <PasswordInput
              className="px-4 py-3 text-base"
              name="confirmPassword"
              placeholder="Powtórz hasło"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {touched.confirmPassword && errors.confirmPassword && (
              <FormError>{errors.confirmPassword}</FormError>
            )}

            <Button
              type="submit"
              className="w-full py-3 font-semibold lg:text-lg"
              disabled={isSubmitting || status === "success"}
            >
              {isSubmitting
                ? "Tworzenie konta..."
                : status === "success"
                  ? "Przechodzenie dalej..."
                  : "Zarejestruj się"}
            </Button>
          </form>
        )}
      </Formik>

      <p className="mt-8 text-center text-base text-muted">
        Masz już konto?{" "}
        <a href="/login" className="font-semibold text-primary">
          Zaloguj się
        </a>
      </p>

      {status === "error" && <div className="mt-5"><FormError>{feedbackMessage}</FormError></div>}

      
      </Card>
    </AuthLayout>
  );
};

export default RegisterPage;
