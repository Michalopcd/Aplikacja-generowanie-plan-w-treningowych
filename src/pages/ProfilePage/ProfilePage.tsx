import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import {
  experienceLevelOptions,
  genderOptions,
  goalOptions,
  trainingDaysOptions,
  trainingLocationOptions,
} from "../../features/onboarding/constants/onboardingOptions";
import { ProfileAvatar } from "../../features/profile/components/ProfileAvatar";

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

const formatDate = (date: Date): string => {
  if (!date) {
    return "Brak danych";
  }

  return date.toLocaleDateString("pl-PL");
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
          <p className="text-center text-lg font-semibold text-primary sm:text-left sm:text-xl">
            Profil użytkownika
          </p>

          <div className="mt-4 flex flex-col items-center gap-6 rounded-2xl border border-border bg-card/40 p-5 sm:flex-row sm:items-center sm:p-6">
            <ProfileAvatar user={user} />

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                Twoje dane i preferencje treningowe
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Tutaj możesz sprawdzić dane konta oraz informacje, na podstawie
                których aplikacja generuje Twój plan treningowy.
              </p>
            </div>
          </div>
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
                <p className="text-sm text-muted">Data utworzenia konta</p>

                <p className="mt-1 font-medium">{formatDate(user.createdAt)}</p>
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
                <p className="text-sm text-muted">Poziom zaawansowania</p>

                <p className="mt-1 font-medium">
                  {getOptionLabel(
                    trainingProfile.experienceLevel,
                    experienceLevelOptions,
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Dni treningowe w tygodniu</p>

                <p className="mt-1 font-medium">
                  {getOptionLabel(
                    trainingProfile.trainingDaysPerWeek,
                    trainingDaysOptions,
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Wiek</p>

                <p className="mt-1 font-medium">{trainingProfile.age} lat</p>
              </div>

              <div>
                <p className="text-sm text-muted">Wzrost</p>

                <p className="mt-1 font-medium">{trainingProfile.height} cm</p>
              </div>

              <div>
                <p className="text-sm text-muted">Waga</p>

                <p className="mt-1 font-medium">{trainingProfile.weight} kg</p>
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
            Dane z profilu treningowego są używane przy generowaniu planu. Na
            ich podstawie aplikacja dobiera cel, poziom trudności, liczbę dni
            treningowych oraz miejsce wykonywania ćwiczeń.
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
