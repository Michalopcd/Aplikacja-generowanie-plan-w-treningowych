import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { User } from "../../../types/user";

type Props = {
  children: React.ReactNode;
};

const user: User = {
  email: "jan@test.pl",
  userName: "Jan",
  role: "user",
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