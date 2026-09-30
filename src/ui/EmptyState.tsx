import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState = ({
  title = "Brak danych",
  description = "Nie ma jeszcze żadnych danych do wyświetlenia.",
  action,
}: Props) => {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
      <Inbox
        size={28}
        className="text-zinc-400"
      />

      <div>
        <p className="font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm text-zinc-300">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
};