import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../features/auth/service";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Container } from "../../ui/Container";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.includes("@")) {
      setError("Podaj poprawny adres e-mail.");
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć minimum 6 znaków.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Hasła nie są takie same.");
      return;
    }

    try {
      setIsLoading(true);

      await registerUser(email, password);

      setSuccess("Konto utworzone");
      navigate("/dashboard");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Ten adres e-mail jest zajęty.");
        return;
      }

      if (error.code === "auth/weak-password") {
        setError("Hasło jest zbyt słabe.");
        return;
      }

      if (error.code === "auth/invalid-email") {
        setError("Niepoprawny adres email.");
        return;
      }

      setError("Nie udało się utworzyć konta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-white">
    <Container className="min-h-screen">
      <div className="grid min-h-screen grid-cols-2 items-center gap-10 py-10">

         <section className="space-y-6">

            <p className="inline-block rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success">
              Zacznij już dziś 
            </p>

            <h2 className="max-w-md text-4xl font-bold leading-tight">
              Zacznij budować swój{" "}
              <span className="text-success">
                plan treningowy.
              </span>
            </h2>

            <p className="max-w-md text-sm text-muted">
              Stwórz konto i otrzymuj spersonalizowane
              plany dopasowane do Twoich celów.
            </p>

          </section>
      <Card className="ml-auto w-full max-w-md p-8">
       <div className="space-y-6">

              <div>
                <h1 className="text-2xl font-bold">
                  Utwórz konto
                </h1>

                <p className="mt-2 text-sm text-muted">
                  Wypełnij formularz, aby utworzyć konto
                </p>
              </div>


              <form
                onSubmit={handleRegister}
                className="space-y-4"
              >

                <Input
                  className="w-full"
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

                <Input
                  className="w-full"
                  type="password"
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <Input
                  className="w-full"
                  type="password"
                  placeholder="Powtórz hasło"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />


                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Tworzenie konta"
                    : "Zarejestruj"}
                </Button>

              </form>


              <p className="text-center text-sm text-muted">
                Masz już konto?{" "}
                <a
                  href="/login"
                  className="text-primary"
                >
                  Zaloguj się
                </a>
              </p>


              {error && (
                <p className="text-sm text-red-400">
                  {error}
                </p>
              )}

              {success && (
                <p className="text-sm text-success">
                  {success}
                </p>
              )}

            </div>

      </Card>
      </div>
    </Container>
    </main>
  );
};

export default RegisterPage;