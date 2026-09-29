import { CircleAlert } from "lucide-react";

type Props = {
  message?: string;
};

export const ErrorState = ({
  message = "Wystąpił błąd podczas pobierania danych.",
}: Props) => {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
      <CircleAlert
        size={28}
        className="text-red-500"
      />

      <p className="text-sm text-zinc-300">
        {message}
      </p>
    </div>
  );
};