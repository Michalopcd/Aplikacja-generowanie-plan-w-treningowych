import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}