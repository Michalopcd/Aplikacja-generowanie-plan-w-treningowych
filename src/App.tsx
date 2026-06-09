import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthLayout } from "./pages/layouts/AuthLayout/AuthLayout";
import {ROUTES} from "../src/utlis/route"

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
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.DASHBOARD} element={<MainLayout><DashboardPage /></MainLayout>} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.ADMIN} element={<AdminExercisesPage/>} />
        <Route path={ROUTES.HISTORY} element={<HistoryPage/>} />
        <Route path={ROUTES.PROGRESS} element={<ProgressPage/>}/>
        <Route path={ROUTES.PLAN} element={<TrainingPlanPage/>} />



        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>


  );
}

export default App;