import { registerUser } from "../../features/auth/service";
const RegisterPage = () => {
  
const handleRegister = async () => {
    try {
      const user = await registerUser(
        "test.test.com",
        "123456"
      );

      console.log(user);
    } catch (error) {
      console.log(error);
    }
  }
  return(
    <div>
      <h1>Register Page</h1>

      <button onClick={handleRegister}>
        Test register
      </button>
    </div>
  )
};

export default RegisterPage;