import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";
import { ROUTES } from "../../utlis/route";

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, isLoading,  } = useAuth();
  
  if (isLoading) {
    return <p>Ładowanie...</p>;
  }

   if (user?.role === "admin") {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }

  if (user && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  if (user ) {
      return <Navigate to="/dashboard" replace />;
  }

  return children;
}
