import { lazy, Suspense } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AdminRoute } from "./features/auth/AdminRoute";
import { GuestRoute } from "./features/auth/GuestRoute";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";

import { DashboardPageSkeleton } from "./features/dashboard/components/DashboardPageSkeleton";
import { ProfilePageSkeleton } from "./features/profile/components/ProfilePageSkeleton";
import { CalendarPageSkeleton } from "./features/training/components/CalendarPageSkeleton";
import { HistoryPageSkeleton } from "./features/training/components/HistoryPageSkeleton";
import { ProgressPageSkeleton } from "./features/training/components/ProgressPageSkeleton";
import { TrainingPlanPageSkeleton } from "./features/training/components/TrainingPlanPageSkeleton";

import { ROUTES } from "./utils/route";

import { LoadingState } from "./ui/LoadingState";
import { MainLayout } from "./pages/layouts/MainLayout/MainLayout";

import "react-toastify/dist/ReactToastify.css";

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));

const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));

const RegisterPage = lazy(() => import("./pages/RegisterPage/RegisterPage"));

const DashboardPage = lazy(() => import("./pages/DashboardPage/DashboardPage"));

const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"));

const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));

const AdminPage = lazy(() => import("./pages/AdminExercisePage/AdminPage"));

const HistoryPage = lazy(() => import("./pages/HistoryPage/HistoryPage"));

const ProgressPage = lazy(() => import("./pages/ProgressPage/ProgressPage"));

const TrainingPlanPage = lazy(
  () => import("./pages/TrainingPlanPage/TrainingPlanPage"),
);

const OnboardingPage = lazy(
  () => import("./pages/OnboardingPage/OnboardingPage"),
);

const CalendarPage = lazy(() => import("./pages/CalendarPage/CalendarPage"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <Suspense fallback={<LoadingState message="Ładowanie strony..." />}>
              <LandingPage />
            </Suspense>
          }
        />

        <Route
          path={ROUTES.LOGIN}
          element={
            <Suspense fallback={<LoadingState message="Ładowanie..." />}>
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            </Suspense>
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            <Suspense fallback={<LoadingState message="Ładowanie..." />}>
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            </Suspense>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <Suspense fallback={<DashboardPageSkeleton />}>
                <DashboardPage />
              </Suspense>
            }
          />

          <Route
            path={ROUTES.PROFILE}
            element={
              <Suspense fallback={<ProfilePageSkeleton />}>
                <ProfilePage />
              </Suspense>
            }
          />

          <Route
            path={ROUTES.HISTORY}
            element={
              <Suspense fallback={<HistoryPageSkeleton />}>
                <HistoryPage />
              </Suspense>
            }
          />

          <Route
            path={ROUTES.PROGRESS}
            element={
              <Suspense fallback={<ProgressPageSkeleton />}>
                <ProgressPage />
              </Suspense>
            }
          />

          <Route
            path={ROUTES.PLAN}
            element={
              <Suspense fallback={<TrainingPlanPageSkeleton />}>
                <TrainingPlanPage />
              </Suspense>
            }
          />

          <Route
            path={`${ROUTES.PLAN}/week/:weekNumber`}
            element={
              <Suspense fallback={<TrainingPlanPageSkeleton />}>
                <TrainingPlanPage />
              </Suspense>
            }
          />

          <Route
            path={ROUTES.CALENDAR}
            element={
              <Suspense fallback={<CalendarPageSkeleton />}>
                <CalendarPage />
              </Suspense>
            }
          />
        </Route>

        <Route
          path={ROUTES.ONBOARDING}
          element={
            <Suspense fallback={<LoadingState message="Ładowanie..." />}>
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            </Suspense>
          }
        />

        <Route
          path={ROUTES.ADMIN}
          element={
            <Suspense
              fallback={
                <LoadingState message="Ładowanie panelu administratora..." />
              }
            >
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </Suspense>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingState message="Ładowanie..." />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </BrowserRouter>
  );
}

export default App;
