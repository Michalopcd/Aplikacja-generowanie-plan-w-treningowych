import { ErrorBoundary } from './ui/ErrorBoundary.tsx';
import { AuthProvider } from './features/auth/AuthContext.tsx';
import { createRoot } from 'react-dom/client'
import "../src/firebase.ts"
import "./index.css";
import App from './App.tsx'



createRoot(document.getElementById('root')!).render(
   <ErrorBoundary>
  <AuthProvider>
    <App />
  </AuthProvider>
</ErrorBoundary>
)
