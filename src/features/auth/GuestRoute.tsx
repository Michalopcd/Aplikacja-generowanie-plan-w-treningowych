import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, isRegistering } = useAuth();

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }

  if (user && !isRegistering) {
    return (
      <Navigate
        to={user.onboardingCompleted ? "/dashboard" : "/onboarding"}
        replace
      />
    );
  }

  return children;
}
