import { useState } from "react";
import LoginBg from "../../assets/loginBg.jpg";
import { Formik } from "formik";
import { loginSchema } from "../../features/auth/validation/loginSchema";
import { loginInitialValues } from "../../features/auth/constants/loginInitialValues";
import { getAuthErrorMessage } from "../../features/auth/errors/authErrors";
import { PasswordInput } from "../../ui/PasswordInput";

import { Flame, BarChart3, Target } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/service";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Card } from "../../ui/Card";
import { FormError } from "../../ui/FormError";
import type { LoginFormValues } from "../../features/auth/types/login";
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    setError("");
    try {
      setIsLoading(true);

      await loginUser(values.email, values.password);
      navigate("/dashboard");
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, "Nie udało sie zalogować."));
    } finally {
      setIsLoading(false);
    }
  };
  const loginHero = (
    <>
      <p className="mb-6 w-fit rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
        Witaj ponownie
      </p>

      <h2 className="text-2xl font-bold leading-tight">
        Kontynuuj swoją <span className="text-success">drogę treningową.</span>
      </h2>

      <p className="mt-4 text-sm leading-6 text-muted">
        Zaloguj się, aby wrócić do swoich planów, śledzić progres oraz
        kontynuować trening.
      </p>

      <div className="mt-6 space-y-3">
        <Card className="p-3">
          <div className="flex items-center gap-4">
            <Flame className="h-6 w-6 text-orange-400" />
            <div>
              <h3 className="text-sm font-semibold text-orange-400">
                Kontynuuj plan
              </h3>
              <p className="mt-1 text-xs text-muted">
                Wróć do ostatniego treningu.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-4">
            <BarChart3 className="h-6 w-6 text-success" />
            <div>
              <h3 className="text-sm font-semibold text-success">
                Twój progres
              </h3>
              <p className="mt-1 text-xs text-muted">Analizuj swoje wyniki.</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-4">
            <Target className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-primary">
                Cele treningowe
              </h3>
              <p className="mt-1 text-xs text-muted">
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
      <div className="mb-6">
        <h1 className="text-center text-2xl font-bold">Zaloguj się</h1>
        <p className="mt-1 text-center text-sm text-muted">
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
        }) => (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              className="w-full px-3 py-1.5 text-sm"
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
  className="px-3 py-1.5 text-sm"
  name="password"
  placeholder="Hasło"
  value={values.password}
  onChange={handleChange}
  onBlur={handleBlur}
/>

            {touched.password && errors.password && (
              <FormError>{errors.password}</FormError>
            )}

            <Button
              type="submit"
              className="w-full py-2 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>
        )}
      </Formik>

      <p className="mt-6 text-center text-sm text-muted">
        Nie masz konta?{" "}
        <a href="/register" className="font-semibold text-primary">
          Zarejestruj się
        </a>
      </p>

      {error && <FormError>{error}</FormError>}
    </AuthLayout>
  );
};

export default LoginPage;
