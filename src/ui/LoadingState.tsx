import { LoaderCircle } from "lucide-react";

type Props = {
  message?: string;
};

export const LoadingState = ({
  message = "Ładowanie...",
}: Props) => {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3">
      <LoaderCircle
        size={28}
        className="animate-spin text-primary"
      />

      <p className="text-sm text-zinc-300">
        {message}
      </p>
    </div>
  );
};