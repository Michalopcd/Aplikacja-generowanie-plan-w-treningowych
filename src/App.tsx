import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ROUTES } from "../src/utlis/route";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { GuestRoute } from "./features/auth/GuestRoute";
import { AdminRoute } from "./features/auth/AdminRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MainLayout } from "./pages/layouts/MainLayout/MainLayout";
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
import CalendarPage from "./pages/CalendarPage/CalendarPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path={ROUTES.LOGIN}
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
          <Route path={ROUTES.PROGRESS} element={<ProgressPage />} />
          <Route path={ROUTES.PLAN} element={<TrainingPlanPage />} />
          <Route path={`${ROUTES.PLAN}/week/:weekNumber`} element={<TrainingPlanPage />}/>
          <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
        </Route>

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN}
          element={
            <AdminRoute>
              <AdminExercisesPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </BrowserRouter>
  );
}

export default App;
