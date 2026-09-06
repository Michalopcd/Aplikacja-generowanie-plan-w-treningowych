import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";
import { ROUTES } from "../../utlis/route";

type Props = {
  children: ReactNode;
};

export const AdminRoute = ({ children }: Props) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Ładowanie...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};