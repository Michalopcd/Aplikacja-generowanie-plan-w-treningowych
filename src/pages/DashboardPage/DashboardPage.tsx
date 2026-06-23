import { logoutUser } from "../../features/auth/service";
import { useNavigate } from "react-router-dom";
const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();

    navigate("/login");
  };
  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={handleLogout}>Wyloguj</button>
    </div>
  );
};

export default DashboardPage;
