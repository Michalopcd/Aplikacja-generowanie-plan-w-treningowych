import { useState } from "react";
import { registerUser } from "../../features/auth/service";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading,setIsLoading]=useState(false);
  const navigate=useNavigate();



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
      setIsLoading(true)
      await registerUser(email, password);
      setSuccess("Konto utworzone");
      navigate("/dashboard");
    } catch (error:any){
      if(error.code==="auth/email-already-in-use"){
        setError("Ten adres e-mail jest zajęty.")
        return;
      }
      if(error.code==="auth/weak-password"){
        setError("Hasło jest zbyt słabe.");
        return;
      }
      if(error.code==="auth/invalid-email"){
        setError("Niepoprawny adres email.");
        return;
      }
      setError("Nie udało się utworzyć konta.");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Rejestracja</h1>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Powtórz hasło"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" disabled={isLoading}>{isLoading ? "Tworzenie konta" : "Zarejestruj"}</button>
      </form>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default RegisterPage;