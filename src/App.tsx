import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ROUTES } from "../src/utlis/route";

import { LoadingState } from "./ui/LoadingState";

import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { GuestRoute } from "./features/auth/GuestRoute";
import { AdminRoute } from "./features/auth/AdminRoute";

import { MainLayout } from "./pages/layouts/MainLayout/MainLayout";

const LandingPage = lazy(
  () =>
    import(
      "./pages/LandingPage/LandingPage"
    ),
);

const LoginPage = lazy(
  () =>
    import(
      "./pages/LoginPage/LoginPage"
    ),
);

const RegisterPage = lazy(
  () =>
    import(
      "./pages/RegisterPage/RegisterPage"
    ),
);

const DashboardPage = lazy(
  () =>
    import(
      "./pages/DashboardPage/DashboardPage"
    ),
);

const ProfilePage = lazy(
  () =>
    import(
      "./pages/ProfilePage/ProfilePage"
    ),
);

const NotFoundPage = lazy(
  () =>
    import(
      "./pages/NotFoundPage/NotFoundPage"
    ),
);

const AdminPage = lazy(
  () =>
    import(
      "./pages/AdminExercisePage/AdminPage"
    ),
);

const HistoryPage = lazy(
  () =>
    import(
      "./pages/HistoryPage/HistoryPage"
    ),
);

const ProgressPage = lazy(
  () =>
    import(
      "./pages/ProgressPage/ProgressPage"
    ),
);

const TrainingPlanPage = lazy(
  () =>
    import(
      "./pages/TrainingPlanPage/TrainingPlanPage"
    ),
);

const OnboardingPage = lazy(
  () =>
    import(
      "./pages/OnboardingPage/OnboardingPage"
    ),
);

const CalendarPage = lazy(
  () =>
    import(
      "./pages/CalendarPage/CalendarPage"
    ),
);

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <LoadingState message="Ładowanie strony..." />
        }
      >
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />

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
            <Route
              path={ROUTES.DASHBOARD}
              element={<DashboardPage />}
            />

            <Route
              path={ROUTES.PROFILE}
              element={<ProfilePage />}
            />

            <Route
              path={ROUTES.HISTORY}
              element={<HistoryPage />}
            />

            <Route
              path={ROUTES.PROGRESS}
              element={<ProgressPage />}
            />

            <Route
              path={ROUTES.PLAN}
              element={<TrainingPlanPage />}
            />

            <Route
              path={`${ROUTES.PLAN}/week/:weekNumber`}
              element={<TrainingPlanPage />}
            />

            <Route
              path={ROUTES.CALENDAR}
              element={<CalendarPage />}
            />
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
                <AdminPage />
              </AdminRoute>
            }
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;