import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { UserProfile } from "../../../types/user";

type Props = {
  children: React.ReactNode;
};

const user: UserProfile = {
  uid: "temporary-user-id",
  firstName: "Jan",
  email: "jan@test.pl",
  role: "user",
  onboardingCompleted: true,
  createdAt: new Date(),
};

export function MainLayout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

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

        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <div className="min-w-0 flex flex-1 flex-col">
          <Header user={user} onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 bg-card p-4 md:p-6 xl:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
