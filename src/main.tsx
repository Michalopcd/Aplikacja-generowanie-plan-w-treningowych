import { createRoot } from "react-dom/client";

import { AuthProvider } from "./features/auth/AuthProvider";

import "./firebase";

import App from "./App";
import { ErrorBoundary } from "./ui/ErrorBoundary";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ErrorBoundary>,
);
