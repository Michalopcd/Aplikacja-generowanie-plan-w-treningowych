import { useState } from "react";
import LoginBg from "../../assets/loginBg.jpg"

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
      <div className="grid h-full grid-cols-1  md:grid-cols-2">
<section className=" order-2 flex flex-col items-center justify-center bg-card px-6  md:px-20  md:order-1 md:py-0 ">
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
      className="order-1 flex  flex-col justify-center bg-cover bg-center px-6 py-10 md:order-2 md:h-full md:px-20 md:py-0">
        <div className="max-w-lg">
          <p className="mb-6 w-fit rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">Witaj ponownie</p>

          <h2 className="text-2xl font-bold leading-tight">Kontynułuj swoją{" "}</h2>
          <span className="text-success">drogę treningową.</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">Zaloguj się, aby wrócić do swoich planów, śledzić progres oraz kontynuować trening.</p>

      </section>
      </div>
    </main>
  );

}

export default LoginPage;