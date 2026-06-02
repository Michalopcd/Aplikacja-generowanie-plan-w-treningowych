import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthLayout } from "./pages/layouts/AuthLayout/AuthLayout";

import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import AdminExercisesPage from "./pages/AdminExercisePage/AdminExercisePage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import ProgressPage from "./pages/ProgressPage/ProgressPage";
import TrainingPlanPage from "./pages/TrainingPlanPage/TrainingPlanPage";


import { MainLayout } from "./pages/layouts/MainLayout/MainLayout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminExercisesPage/>} />
        <Route path="/history" element={<HistoryPage/>} />
        <Route path="/progress" element={<ProgressPage/>}/>
        <Route path="/plan" element={<TrainingPlanPage/>} />



        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>


  );
}

export default App;