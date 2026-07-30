import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import {
  experienceLevelOptions,
  genderOptions,
  goalOptions,
  trainingDaysOptions,
  trainingLocationOptions,
} from "../../features/onboarding/constants/onboardingOptions";

import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

type Option = {
  value: string;
  label: string;
};

const getOptionLabel = (
  value: string | number | undefined,
  options: Option[],
): string => {
  if (value === undefined || value === "") {
    return "Brak danych";
  }

  const selectedOption = options.find(
    (option) => option.value === String(value),
  );

  return selectedOption?.label || "Brak danych";
};

const formatDate = (date: unknown): string => {
  if (date instanceof Date) {
    return date.toLocaleDateString("pl-PL");
  }

  if (
    typeof date === "object" &&
    date !== null &&
    "toDate" in date &&
    typeof date.toDate === "function"
  ) {
    return date.toDate().toLocaleDateString("pl-PL");
  }

  return "Brak danych";
};

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <main className="min-h-screen bg-background p-6 text-white">
        <Card className="mx-auto max-w-3xl p-6">
          <h1 className="text-2xl font-bold">Profil użytkownika</h1>

          <p className="mt-4 text-muted">
            Nie udało się pobrać danych użytkownika.
          </p>
        </Card>
      </main>
    );
  }

  const trainingProfile = user.trainingProfile;

  if (!trainingProfile) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background p-6 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-primary">
            Profil użytkownika
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Twoje dane i preferencje treningowe
          </h1>

          <p className="mt-2 max-w-2xl text-muted">
            Tutaj możesz sprawdzić dane konta oraz informacje, na
            podstawie których aplikacja generuje Twój plan treningowy.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Dane konta</h2>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-muted">Imię</p>
                <p className="mt-1 font-medium">
                  {user.firstName || "Brak danych"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Email</p>
                <p className="mt-1 font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted">Rola</p>
                <p className="mt-1 font-medium">{user.role}</p>
              </div>

              <div>
                <p className="text-sm text-muted">
                  Data utworzenia konta
                </p>
                <p className="mt-1 font-medium">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold">Profil treningowy</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted">Cel treningowy</p>
                <p className="mt-1 font-medium">
                  {getOptionLabel(trainingProfile.goal, goalOptions)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Miejsce treningu</p>
                <p className="mt-1 font-medium">
                  {getOptionLabel(
                    trainingProfile.trainingLocation,
                    trainingLocationOptions,
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">
                  Poziom zaawansowania
                </p>
                <p className="mt-1 font-medium">
                  {getOptionLabel(
                    trainingProfile.experienceLevel,
                    experienceLevelOptions,
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">
                  Dni treningowe w tygodniu
                </p>
                <p className="mt-1 font-medium">
                  {getOptionLabel(
                    trainingProfile.trainingDaysPerWeek,
                    trainingDaysOptions,
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Wiek</p>
                <p className="mt-1 font-medium">
                  {trainingProfile.age} lat
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Wzrost</p>
                <p className="mt-1 font-medium">
                  {trainingProfile.height} cm
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Waga</p>
                <p className="mt-1 font-medium">
                  {trainingProfile.weight} kg
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Płeć</p>
                <p className="mt-1 font-medium">
                  {getOptionLabel(trainingProfile.gender, genderOptions)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">
            Informacja o generowaniu planu
          </h2>

          <p className="mt-3 text-muted">
            Dane z profilu treningowego są używane przy generowaniu
            planu. Na ich podstawie aplikacja dobiera cel, poziom
            trudności, liczbę dni treningowych oraz miejsce wykonywania
            ćwiczeń.
          </p>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => navigate("/dashboard")}>
            Wróć do dashboardu
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;