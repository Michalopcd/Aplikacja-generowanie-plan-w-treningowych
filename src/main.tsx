import { StrictMode } from 'react'
import { AuthProvider } from './features/auth/AuthContext.tsx';
import { createRoot } from 'react-dom/client'
import "../src/firebase.ts"
import "./index.css";
import App from './App.tsx'
import React from "react"


createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
