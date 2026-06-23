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
  return (
    <div className="min-h-screen bg-card text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Header user={user} />

          <main className="flex-1 bg-card p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}