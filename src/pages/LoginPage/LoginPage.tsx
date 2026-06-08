import { useState } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

const LoginPage = () => {
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const handleLogin = (e:React.FormEvent) => {
  e.preventDefault();
  console.log(email,password);
}

return(
  <form onSubmit={handleLogin}>
    <Input 
    type="email"
    name="email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    />
    <Input
    type="password"
    name="password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    />

    <Button type="submit">Zaloguj się</Button>
  </form>
)
}

export default LoginPage;