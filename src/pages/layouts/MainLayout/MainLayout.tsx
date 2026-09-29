import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../../features/auth/AuthContext";


export function MainLayout() {
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-card text-white">
      <div className="flex min-h-screen">
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Zamknij menu"
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
          />
        )}

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        <div className="min-w-0 flex flex-1 flex-col">
          <Header
            user={user}
            onMenuClick={() =>
              setIsSidebarOpen(true)
            }
          />

          <main className="flex-1 bg-card p-4 md:p-6 xl:p-8">
            <div className="mx-auto w-full max-w-[1440px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}