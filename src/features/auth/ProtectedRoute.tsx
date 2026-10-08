import type { ReactNode } from "react";

import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "./AuthContext";

import { isOnboardingCompleted } from "./utils/isOnboardingCompleted";
import { ROUTES } from "../../utils/route";

type Props = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
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

  const isOnboardingPage = location.pathname === ROUTES.ONBOARDING;

  if (!onboardingCompleted && !isOnboardingPage) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  if (onboardingCompleted && isOnboardingPage) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
