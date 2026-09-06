import { useState } from "react";
import LoginBg from "../../assets/loginBg.jpg";
import { Formik } from "formik";
import { loginSchema } from "../../features/auth/validation/loginSchema";
import { loginInitialValues } from "../../features/auth/constants/loginInitialValues";
import { getAuthErrorMessage } from "../../features/auth/errors/authErrors";
import { PasswordInput } from "../../ui/PasswordInput";
import { Link } from "react-router-dom";

import { Flame, BarChart3, Target } from "lucide-react";

import { useAuth } from "../../features/auth/AuthContext";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Card } from "../../ui/Card";
import type { LoginFormValues } from "../../features/auth/types/login";
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout";

type LoginFormStatus = "idle" | "error";

const LoginPage = () => {
  const [status, setStatus] = useState<LoginFormStatus>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { login } = useAuth();

  const handleLogin = async (values: LoginFormValues) => {
    setStatus("idle");
    setFeedbackMessage("");
    try {
      await login(values.email, values.password);
    } catch (error: unknown) {
      setStatus("error");
      setFeedbackMessage(
        getAuthErrorMessage(error, "Nie udało się zalogować."),
      );
    }
  };
  const loginHero = (
    <>
      <p className="text-3xl font-bold leading-tight lg:text-4xl xl:text-5xl">
        Kontynuuj swoją <span className="text-success">drogę treningową.</span>
      </p>

      <p className="mt-5 text-base leading-7 text-zinc-300">
        Zaloguj się, aby wrócić do swoich planów, śledzić progres oraz
        kontynuować trening.
      </p>

      <div className="mt-8 space-y-4">
        <Card className="p-4 lg:p-5">
          <div className="flex items-center gap-5">
            <Flame className="h-7 w-7 shrink-0 text-orange-400" />

            <div>
              <h3 className="text-base font-semibold text-orange-400">
                Kontynuuj plan
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                Wróć do ostatniego treningu.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-5">
          <div className="flex items-center gap-5">
            <BarChart3 className="h-7 w-7 shrink-0 text-success" />

            <div>
              <h3 className="text-base font-semibold text-success">
                Twój progres
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                Analizuj swoje wyniki.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-5">
          <div className="flex items-center gap-5">
            <Target className="h-7 w-7 shrink-0 text-primary" />

            <div>
              <h3 className="text-base font-semibold text-primary">
                Cele treningowe
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                Kontynuuj drogę do lepszej formy.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
  return (
    <AuthLayout hero={loginHero} heroImage={LoginBg} heroPosition="right">
      <Card className="w-full bg-auth-card p-7 shadow-xl sm:p-8 lg:p-10 xl:p-12">
        <div className="mb-8">
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            Zaloguj się
          </h1>
          <p className="mt-2 text-center text-base text-zinc-300">
            Wróć do swojego planu treningowego
          </p>
        </div>

        <Formik
          initialValues={loginInitialValues}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                className="w-full px-4 py-3 text-base"
                type="email"
                name="email"
                placeholder="E-mail"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
              />

              <PasswordInput
                className="px-4 py-3 text-base"
                name="password"
                placeholder="Hasło"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : undefined}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                className="w-full py-3 font-semibold lg:text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logowanie..." : "Zaloguj się"}
              </Button>
            </form>
          )}
        </Formik>

        <p className="mt-8 text-center text-base text-zinc-300">
          Nie masz konta?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary transition hover:text-violet-400"
          >
            Zarejestruj się
          </Link>
        </p>

        {status === "error" && (
          <p className="mt-4 text-sm text-red-400">{feedbackMessage}</p>
        )}
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
