import { useState } from "react";
import LoginBg from "../../assets/loginBg.jpg";
import { Formik } from "formik";
import { loginSchema } from "../../features/auth/validation/loginSchema";
import { loginIntialValues } from "../../features/auth/constants/loginInitialValues";

import { Flame, BarChart3, Target } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/service";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Card } from "../../ui/Card";
import { FormError } from "../../ui/FormError";
import type { LoginFormValues } from "../../features/auth/types/login";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (values:LoginFormValues) => {
    setError("");
    try {
      setIsLoading(true);

      await loginUser(values.email, values.password);
      navigate("/dashboard");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setError("Niepoprawny e-mail lub hasło.");
        return;
      }

      if (error.code === "auth/invalid-email") {
        setError("Niepoprawny adres e-mail.");
        return;
      }

      setError("Nie udało się zalogować.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="min-h-screen  bg-card text-white md:h-screen">
      <div className="grid h-full grid-cols-1  md:grid-cols-2">
        <section className=" order-2 flex flex-col items-center justify-center bg-card px-6 py-16  md:px-20  md:order-1 md:py-0 ">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-center">Zaloguj się</h1>
              <p className="mt-1 text-sm text-muted text-center">
                Wróć do swojego planu treningowego
              </p>
            </div>

            <Formik
              initialValues={loginIntialValues}
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
                  <Input
                    className="w-full px-3 py-1.5 text-sm"
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleChange}
                  />
                  {touched.password && errors.password && (
                    <FormError>{errors.password}</FormError>
                  )}
                  <Button type="submit" className="w-full py-2 font-semibold">
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
            {error && (
              <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                {error}
              </p>
            )}
          </div>
        </section>
        <section
          style={{
            backgroundImage: `
      linear-gradient(
        rgba(0,0,0,0.65),
        rgba(0,0,0,0.85)
      ),
      url(${LoginBg})
    `,
          }}
          className="order-1 flex  flex-col justify-center bg-cover bg-center px-6 py-10 md:order-2 md:h-full md:px-20 md:py-0"
        >
          <div className="max-w-lg">
            <p className="mb-6 w-fit rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              Witaj ponownie
            </p>

            <h2 className="text-2xl font-bold leading-tight">
              Kontynuuj swoją{" "}
            </h2>
            <span className="text-success">drogę treningową.</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Zaloguj się, aby wrócić do swoich planów, śledzić progres oraz
            kontynuować trening.
          </p>
          <div className="mt-6 space-y-3">
            <Card className="p-3">
              <div className="flex items-center gap-4">
                <Flame className="text-sm font-semibold text-orange-400 " />
                <div>
                  <h3 className="text-sm font-semibold text-orange-400">
                    Kontynuuj plan
                  </h3>
                  <p className="mt-1 text-xs text-muted ">
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
                  <p className="mt-1 text-xs text-muted">
                    Analizuj swoje wyniki.
                  </p>
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
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
