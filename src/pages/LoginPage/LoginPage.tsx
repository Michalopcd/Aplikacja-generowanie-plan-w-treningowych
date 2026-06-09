import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/service";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]=useState("");
  const [isLoading,setIsLoading]=useState(false);

  const navigate=useNavigate();

  const validateEmail=()=>{
    if(!email.includes("@")){
      setError("Podaj poprawny adres email.");
      return false; 
    }
    setError("");
    return true;
  }
  const validatePassword = () => {
    if(password.length<6){
      setError("Hasło musi mieć minimum 6 znaków.");
    }
    setError("");
    return false;
  } 
  const validateForm=()=>{
    return(
      validateEmail() &&
      validatePassword()
    );
  };


  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();

    if(!validateForm()){
      return;
    }
   
   
   try{
    setIsLoading(true);

    await loginUser(email,password);
    navigate("/dashboard");


   }catch (error: any) {
    if (error.code === "auth/invalid-credential") {
      setError("Niepoprawny e-mail lub hasło.");
      return;
    }

    if (error.code === "auth/invalid-email") {
      setError("Niepoprawny adres e-mail.");
      return;
    }

    setError("Nie udało się zalogować.");


  }finally{
    setIsLoading(false);
  };
}
  return (
    <main className="min-h-screen bg-bg text-white">
      <form onSubmit={handleLogin}>
        <h1>Zaloguj się</h1>

        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
        />

        <Input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={validatePassword}
        />

        <Button type="submit">
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );

}

export default LoginPage;