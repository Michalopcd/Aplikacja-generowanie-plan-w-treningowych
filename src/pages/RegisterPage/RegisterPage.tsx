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
    <Container>
      <Card>
        <h1>Utwórz konto</h1>

        <p>Wypełnij formularz, aby utworzyć konto</p>

        <form onSubmit={handleRegister}>
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Powtórz hasło"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Tworzenie konta" : "Zarejestruj"}
          </Button>
        </form>

        <p>
          Masz już konto? <a href="/login">Zaloguj się</a>
        </p>

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </Card>
    </Container>
  );
};

export default RegisterPage;