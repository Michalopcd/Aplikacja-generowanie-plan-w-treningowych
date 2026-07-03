import { useAuth } from "../../features/auth/AuthContext";
import { generateWorkoutPlan } from "../../features/training/utils/generateWorkoutPlan";

const TrainingPlanPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Ładowanie...
      </div>
    );
  }

  if (!user?.trainingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Brak danych treningowych użytkownika.
      </div>
    );
  }

  const plan = generateWorkoutPlan(user.trainingProfile);

  console.log("Wygenerowany plan:", plan);

  return (
    <main className="min-h-screen bg-card p-4 text-white md:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-bold md:text-3xl">
          Test generatora planu
        </h1>

        <p className="mt-2 text-sm text-muted">
          Tymczasowy podgląd wygenerowanego planu treningowego.
        </p>

        <pre className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface p-4 text-xs leading-6 text-white">
          {JSON.stringify(plan, null, 2)}
        </pre>
      </div>
    </main>
  );
};

export default TrainingPlanPage;