import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { registerSchema } from "../../features/auth/validation/registerSchema";
import type { RegisterFormValues } from "../../features/auth/types/register";
import { getAuthErrorMessage } from "../../features/auth/errors/authErrors";

import { registerUser } from "../../features/auth/service";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { PasswordInput } from "../../ui/PasswordInput";
import { FormError } from "../../ui/FormError";
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout";
import registerBg from "../../assets/registerBg.jpg";

import { Dumbbell, TrendingUp, History } from "lucide-react";
import { registerInitalValues } from "../../features/auth/constants/registerInitialValues";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (values: RegisterFormValues) => {
    setError("");
    setSuccess("");

    try {
      setIsLoading(true);

      await registerUser(values.email, values.password);

      setSuccess("Konto utworzone");
      navigate("/dashboard");
    } catch (error: any) {
      setError(getAuthErrorMessage(error,"Nie udało sie utworzyć konta."))
    } finally {
      setIsLoading(false);
    }
  };
  const registerHero = (
    <>
          <div className="max-w-lg">
            <p className="mb-6 w-fit rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              Zacznij już dziś
            </p>

            <h2 className="text-2xl font-bold leading-tight">
              Zacznij budować swój{" "}
              <span className="text-success">plan treningowy.</span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted">
              Stwórz konto i otrzymuj spersonalizowane plany dopasowane do
              Twoich celów.
            </p>
            <div className="mt-6 space-y-3">
              <Card className="p-3">
                <div className="flex items-center gap-4">
                  <Dumbbell className="h-6 w-6 text-success" />
                  <div>
                    <h3 className="text-sm font-semibold text-success">
                      Personalizowane plany
                    </h3>

                    <p className="mt-1 text-xs text-muted">
                      Treningi dopasowane do Twoich celów.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <TrendingUp className="h-6 w-6 text-success" />
                  <div>
                    <h3 className="text-sm font-semibold text-success">
                      Śledzenie postępów
                    </h3>

                    <p className="mt-1 text-xs text-muted">
                      Monitoruj swoją aktywność i progres.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <History className="h-6 w-6 text-orange-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-orange-400">
                      Historia treningów
                    </h3>

                    <p className="mt-1 text-xs text-muted">
                      Wracaj do wykonanych treningów i wyników.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        
    </>
  )

  return (
    
        
<AuthLayout hero={registerHero} heroImage={registerBg} heroPosition="left">
      <div className="mb-6">
        <h1 className="text-center text-2xl font-bold">Zarejestruj się</h1>
        <p className="mt-1 text-center text-sm text-muted">
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

            <PasswordInput
  className="px-3 py-1.5 text-sm"
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
              className="w-full py-2 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>
        )}
      </Formik>

      <p className="mt-6 text-center text-sm text-muted">
        Masz już konto?{" "}
        <a href="/register" className="font-semibold text-primary">
          Zaloguj się
        </a>
      </p>

      {error && <FormError>{error}</FormError>}

       
    </AuthLayout>
    
  );
};

export default RegisterPage;
