import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

import { ROUTES } from "../../utils/route";

type Props = {
  children: ReactNode;
};

export function GuestRoute({ children }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }

  if (user?.role === "admin") {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }

  if (user && !user.onboardingCompleted) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
