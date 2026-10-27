import { Link } from "react-router-dom";
import { CheckCircle2, Dumbbell } from "lucide-react";

import { ROUTES } from "../../utils/route";

import calendarImage from "../../assets/calendar.png";
import dashboardImage from "../../assets/dashboard.png";
import profileConfigurationImage from "../../assets/profileConfiguration.png";
import trainingPlanImage from "../../assets/TrainingPlan.png";

const HOW_IT_WORKS_STEPS = [
  {
    title: "Załóż konto",
    description:
      "Utwórz konto i przejdź do konfiguracji swojego profilu treningowego.",
  },
  {
    title: "Uzupełnij profil",
    description:
      "Podaj swój cel, poziom zaawansowania, miejsce treningu i liczbę dni w tygodniu.",
  },
  {
    title: "Wygeneruj plan",
    description:
      "FitPlan przygotuje plan treningowy na podstawie podanych informacji.",
  },
  {
    title: "Realizuj treningi",
    description:
      "Korzystaj z planu, oznaczaj wykonane treningi i sprawdzaj swoje postępy.",
  },
];

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-card text-white">
      <header className="border-b border-border bg-nav">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Dumbbell size={20} />
            </div>

            <span className="text-2xl font-bold text-primary">FitPlan</span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to={ROUTES.LOGIN}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition hover:text-white sm:px-4"
            >
              Zaloguj się
            </Link>

            <Link
              to={ROUTES.REGISTER}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Załóż konto
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Indywidualny plan treningowy
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              <span className="block">Twój plan.</span>

              <span className="block text-primary">Twój progres.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
              Generuj plan treningowy dopasowany do Twojego celu, poziomu
              zaawansowania, miejsca treningu i liczby dni w tygodniu.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={ROUTES.REGISTER}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Zacznij trenować
              </Link>

              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 font-semibold text-white transition hover:bg-card"
              >
                Mam już konto
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="border-b border-border pb-5">
              <p className="text-sm font-semibold text-primary">
                Przykładowy plan
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Twój tydzień treningowy
              </h2>

              <p className="mt-2 text-sm text-muted">
                Przykład planu wygenerowanego na podstawie danych z profilu.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary">
                      Poniedziałek
                    </p>

                    <p className="mt-2 font-semibold">Trening całego ciała A</p>

                    <p className="mt-1 text-sm text-muted">
                      Klatka, barki, biceps, triceps
                    </p>
                  </div>

                  <span className="shrink-0 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    3 ćwiczenia
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary">
                      Środa
                    </p>

                    <p className="mt-2 font-semibold">Trening całego ciała B</p>

                    <p className="mt-1 text-sm text-muted">
                      Plecy, nogi, pośladki
                    </p>
                  </div>

                  <span className="shrink-0 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    3 ćwiczenia
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary">
                      Piątek
                    </p>

                    <p className="mt-2 font-semibold">Trening całego ciała A</p>

                    <p className="mt-1 text-sm text-muted">
                      Klatka, barki, biceps, triceps
                    </p>
                  </div>

                  <span className="shrink-0 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    3 ćwiczenia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface/20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Dopasowanie planu
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Najpierw poznajemy Twoje potrzeby
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-muted">
              Przy pierwszym uruchomieniu podajesz podstawowe informacje
              potrzebne do przygotowania planu treningowego.
            </p>

            <p className="mt-5 max-w-lg text-sm leading-6 text-muted">
              Cel treningowy, poziom doświadczenia, miejsce treningu oraz liczba
              dni wpływają na to, jak wygląda wygenerowany plan.
            </p>
          </div>

          <div className="flex h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface p-2 sm:h-[340px] lg:h-[420px] lg:max-w-[760px] lg:justify-self-end">
            <img
              src={profileConfigurationImage}
              alt="Konfiguracja profilu treningowego w aplikacji FitPlan"
              className="h-auto w-auto max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Plan treningowy
            </p>

            <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight sm:text-4xl">
              Przejrzysty plan na każdy tydzień
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-muted">
              Otrzymujesz plan z konkretnymi dniami treningowymi, ćwiczeniami,
              liczbą serii i zakresem powtórzeń.
            </p>

            <div className="mt-7 space-y-4 text-sm text-muted">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <span>
                  Plan dopasowany do celu treningowego i poziomu zaawansowania.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <span>
                  Szczegółowe ćwiczenia, partie mięśniowe i liczba powtórzeń.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <span>Możliwość oznaczania wykonanych treningów.</span>
              </div>
            </div>
          </div>

          <div className="flex h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface p-2 sm:h-[340px] lg:h-[420px] lg:max-w-[760px] lg:justify-self-end">
            <img
              src={trainingPlanImage}
              alt="Plan treningowy użytkownika"
              className="h-auto w-auto max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface/20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div className="order-2 flex h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface p-2 sm:h-[340px] lg:order-1 lg:h-[420px] lg:max-w-[760px]">
            <img
              src={calendarImage}
              alt="Kalendarz treningów FitPlan"
              className="h-auto w-auto max-h-full max-w-full object-contain"
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Kalendarz treningów
            </p>

            <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight sm:text-4xl">
              Planuj i organizuj swoje treningi
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-muted">
              Zobacz cały miesiąc, sprawdź zaplanowane treningi i w prosty
              sposób przenieś je na inne dni.
            </p>

            <div className="mt-7 space-y-4 text-sm text-muted">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <span>Przejrzysty widok całego miesiąca.</span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <span>Możliwość przenoszenia treningów na inne dni.</span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <span>Szybki podgląd szczegółów treningu.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Dashboard i postępy
            </p>

            <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight sm:text-4xl">
              Najważniejsze informacje w jednym miejscu
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-muted">
              Dashboard pokazuje bieżący tydzień, dzisiejszy trening, postęp
              realizacji planu oraz ostatnią aktywność.
            </p>

            <div className="mt-7 space-y-4 text-sm text-muted">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <span>Liczba wykonanych treningów.</span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <span>Postęp aktualnego planu i tygodnia.</span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <span>Ostatnio wykonane treningi i seria aktywności.</span>
              </div>
            </div>
          </div>

          <div className="flex h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface p-2 sm:h-[340px] lg:h-[420px] lg:max-w-[760px] lg:justify-self-end">
            <img
              src={dashboardImage}
              alt="Dashboard aplikacji FitPlan"
              className="h-auto w-auto max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Jak to działa?
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                Od rejestracji do pierwszego treningu
              </h2>

              <p className="mt-5 leading-7 text-muted">
                Najpierw uzupełniasz kilka informacji o sobie i sposobie
                treningu. Na ich podstawie aplikacja przygotowuje plan, z
                którego możesz od razu korzystać.
              </p>

              <div className="mt-8 border-l-2 border-primary pl-5">
                <p className="font-semibold text-white">Co otrzymujesz?</p>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Plan treningowy podzielony na tygodnie, kalendarz treningów
                  oraz podgląd wykonanych aktywności i postępów.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <div key={step.title} className="flex gap-5">
                  <span className="pt-1 text-sm font-semibold text-primary">
                    {index + 1}.
                  </span>

                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-nav">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-7 text-center text-sm text-muted sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <Dumbbell size={18} className="text-primary" />

            <span className="font-semibold text-white">FitPlan</span>
          </div>

          <p>Twój plan treningowy. Twoja regularność. Twój progres.</p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
