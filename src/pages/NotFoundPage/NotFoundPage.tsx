import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { Card } from "../../ui/Card";

const NotFoundPage = () => {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-card p-4 text-white">
      <Card className="w-full max-w-md bg-surface p-6 text-center">
        <p className="text-sm font-semibold text-primary">
          Błąd 404
        </p>

        <h1 className="mt-2 text-2xl font-bold">
          Nie znaleziono strony
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Strona, której szukasz, nie istnieje lub
          została przeniesiona.
        </p>

        {!isLoading && (
          <Link
            to={user ? "/dashboard" : "/"}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {user
              ? "Wróć do dashboardu"
              : "Wróć na stronę główną"}
          </Link>
        )}
      </Card>
    </div>
  );
};

export default NotFoundPage;