import { createRoot } from "react-dom/client";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { AuthProvider } from "./features/auth/AuthProvider";

import { QUERY_CACHE_MAX_AGE, queryClient, queryPersister} from "./config/queryClient";
import "./firebase";

import App from "./App";
import { ErrorBoundary } from "./ui/ErrorBoundary";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: QUERY_CACHE_MAX_AGE,
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </PersistQueryClientProvider>
  </ErrorBoundary>,
);
