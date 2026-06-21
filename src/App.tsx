import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ROUTES } from "../src/utlis/route";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { GuestRoute } from "./features/auth/GuestRoute";

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
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<GuestRoute><LoginPage /></GuestRoute>}/>
        <Route path={ROUTES.REGISTER} element={<GuestRoute><RegisterPage /></GuestRoute>}/>
        <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}/>
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.ADMIN} element={<AdminExercisesPage />} />
        <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
        <Route path={ROUTES.PROGRESS} element={<ProgressPage />} />
        <Route path={ROUTES.PLAN} element={<TrainingPlanPage />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>}/>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
