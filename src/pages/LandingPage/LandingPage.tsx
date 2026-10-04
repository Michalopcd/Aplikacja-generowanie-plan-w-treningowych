import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/route";
import { Dumbbell, Dot } from "lucide-react";
const LandingPage = () => {
  return (
    <main className="animate-page-enter min-h-screen bg-card text-white">
      <header className="border-b border-border bg-nav">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Dumbbell size={20} />
            </div>

            <span className="text-2xl font-bold text-primary">FitPlan</span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              to={ROUTES.LOGIN}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:text-white"
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

      <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Indywidualny plan treningowy
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            <span className="block">Twój plan.</span>

            <span className="block text-primary">Twój progres.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
            Generuj plan treningowy dopasowany do Twojego celu, poziomu
            zaawansowania, miejsca treningu i liczby dni w tygodniu.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
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

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <p className="text-sm font-semibold text-primary">
            Twój plan treningowy
          </p>

          <h2 className="mt-2 text-2xl font-bold">Plan dopasowany do Ciebie</h2>

          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Przykładowy tygodniowy układ treningów wygenerowany na podstawie
            profilu użytkownika.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-primary">PONIEDZIAŁEK</p>

              <p className="mt-1 font-semibold">Push</p>

              <div className="mt-1 flex flex-wrap items-center text-sm text-muted">
                <span>Klatka</span>
                <Dot size={16} />
                <span>Barki</span>
                <Dot size={16} />
                <span>Triceps</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-primary">ŚRODA</p>

              <p className="mt-1 font-semibold">Pull</p>

              <div className="mt-1 flex flex-wrap items-center text-sm text-muted">
                <span>Plecy</span>
                <Dot size={16} />
                <span>Biceps</span>
                <Dot size={16} />
                <span>Core</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-primary">PIĄTEK</p>

              <p className="mt-1 font-semibold">Legs</p>

              <div className="mt-1 flex flex-wrap items-center text-sm text-muted">
                <span>Nogi</span>
                <Dot size={16} />
                <span>Pośladki</span>
                <Dot size={16} />
                <span>Core</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Funkcjonalności
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Wszystko, czego potrzebujesz do treningu
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
              Aplikacja pomaga zaplanować trening, kontrolować jego realizację i
              obserwować swoje postępy.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-sm font-semibold text-primary">01</p>

              <h3 className="mt-3 text-lg font-bold">Indywidualny plan</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Plan treningowy generowany na podstawie celu, poziomu
                zaawansowania, miejsca treningu i liczby dni w tygodniu.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-sm font-semibold text-primary">02</p>

              <h3 className="mt-3 text-lg font-bold">Kalendarz treningów</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Wszystkie zaplanowane treningi możesz przeglądać w kalendarzu i
                zmieniać ich termin.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-sm font-semibold text-primary">03</p>

              <h3 className="mt-3 text-lg font-bold">Śledzenie postępów</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Historia wykonanych treningów oraz statystyki pomagają
                kontrolować regularność.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-sm font-semibold text-primary">04</p>

              <h3 className="mt-3 text-lg font-bold">Elastyczny plan</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Po zmianie danych treningowych możesz wygenerować nowy plan
                odpowiadający aktualnym potrzebom.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Jak to działa
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Twój plan w kilku krokach
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
              Uzupełnij podstawowe informacje o sobie, a aplikacja przygotuje
              plan dostosowany do Twoich potrzeb.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                1
              </div>

              <h3 className="mt-4 text-lg font-bold">Utwórz konto</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Zarejestruj się i uzyskaj dostęp do swojego profilu
                treningowego.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                2
              </div>

              <h3 className="mt-4 text-lg font-bold">Uzupełnij profil</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Podaj swój cel, poziom doświadczenia, miejsce treningu oraz
                liczbę dni.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                3
              </div>

              <h3 className="mt-4 text-lg font-bold">Otrzymaj plan</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Generator dobierze dni treningowe, ćwiczenia, serie oraz zakres
                powtórzeń.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                4
              </div>

              <h3 className="mt-4 text-lg font-bold">Śledź progres</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Oznaczaj wykonane treningi i obserwuj swoją aktywność oraz
                postępy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Zacznij teraz
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Gotowy na swój plan treningowy?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
            Załóż konto, uzupełnij profil i wygeneruj plan dopasowany do Twojego
            celu treningowego.
          </p>

          <Link
            to={ROUTES.REGISTER}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Załóż konto
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-nav">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6 lg:px-8">
          <p className="font-semibold text-white">FitPlan</p>

          <p className="text-center sm:text-left text-zinc-300">
            Indywidualne plany treningowe dopasowane do użytkownika.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
