import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../src/firebase.ts"
import "./index.css";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
</React.StrictMode>
)
