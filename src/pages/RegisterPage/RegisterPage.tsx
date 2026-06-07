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
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <section className="flex flex-col justify-center bg-card px-6 py-10 md:h-full md:px-20">
        <div className="max-w-lg">
          <p className="mb-6 w-fit rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            Zacznij już dziś
          </p>

          <h2 className="text-3xl font-bold leading-tight">
            Zacznij budować swój{" "}
            <span className="text-success">
              plan treningowy.
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-muted">
            Stwórz konto i otrzymuj spersonalizowane plany dopasowane do Twoich
            celów.
          </p>
          <div className="mt-6 space-y-3">

  <Card className="p-3">
    <h3 className="text-sm font-semibold text-success">
      Personalizowane plany
    </h3>

    <p className="mt-1 text-xs text-muted">
      Treningi dopasowane do Twoich celów.
    </p>
  </Card>


  <Card className="p-4">
    <h3 className="text-sm font-semibold text-success">
      Śledzenie postępów
    </h3>

    <p className="mt-1 text-xs text-muted">
      Monitoruj swoją aktywność i progres.
    </p>
  </Card>


  <Card className="p-4">
    <h3 className="text-sm font-semibold text-orange-400">
      Historia treningów
    </h3>

    <p className="mt-1 text-xs text-muted">
      Wracaj do wykonanych treningów i wyników.
    </p>
  </Card>

</div>
        </div>
        
      </section>

      <section className="flex flex-col justify-center bg-background px-6 py-10 md:h-full md:px-20">
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Utwórz konto
            </h1>

            <p className="mt-2 text-sm text-muted">
              Wypełnij formularz, aby utworzyć konto
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              className="w-full"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              className="w-full"
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              className="w-full"
              type="password"
              placeholder="Powtórz hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full py-3 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Tworzenie konta" : "Zarejestruj"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Masz już konto?{" "}
            <a href="/login" className="font-semibold text-primary">
              Zaloguj się
            </a>
          </p>

          {error && (
            <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-4 rounded-lg bg-green-500/10 p-3 text-sm text-success">
              {success}
            </p>
          )}
        </div>
      </section>
    </div>
  </main>
);
};

export default RegisterPage;