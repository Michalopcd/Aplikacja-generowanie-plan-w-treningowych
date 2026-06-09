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
    <main className="min-h-screen  bg-card text-white md:h-screen">
      <div className="grid min-h-screen grid-cols-1 md:h-full md:min-h-0 md:grid-cols-2">
<section className="flex flex-col items-center justify-center bg-card px-6 py-10 md:h-full md:px-20 md:py-0 ">
<div className="w-full max-w-md">
  <div className="mb-6">
    <h1 className="text-2xl font-bold">Zaloguj się</h1>
    <p className="mt-1 text-sm text-muted">Wróć do swojego planu treningowego</p>

  </div>
      
      <form onSubmit={handleLogin} className="space-y-3">
       
        <Input
           className="w-full px-3 py-1.5 text-sm"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
        />

        <Input
         className="w-full px-3 py-1.5 text-sm"
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={validatePassword}
        />

        <Button type="submit" className="w-full py-2 font-semibold">
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </form>
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
      </section>
      </div>
    </main>
  );

}

export default LoginPage;