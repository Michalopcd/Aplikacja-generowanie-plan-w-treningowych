import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./Button";
type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Nieobsłużony błąd aplikacji:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-card p-4 text-white">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-center">
            <h1 className="text-2xl font-bold">Coś poszło nie tak</h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              Wystąpił nieoczekiwany błąd aplikacji. Spróbuj odświeżyć stronę.
            </p>

            <Button type="button" onClick={this.handleReload} className="mt-6">
              Odśwież stronę
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
