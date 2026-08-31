import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "./AuthContext";
import { isOnboardingCompleted } from "./utlis/isOnboardingCompleted";
import { ROUTES } from "../../utlis/route";

export function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
 if (user.role === "admin") {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }
  const onboardingCompleted = isOnboardingCompleted(user);
  const isOnboardingPage = location.pathname === "/onboarding";

  if (!onboardingCompleted && !isOnboardingPage) {
    return <Navigate to="/onboarding" replace />;
  }

  if (onboardingCompleted && isOnboardingPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}