import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type Props = {
  to: string;
  children: ReactNode;
  icon: LucideIcon;
};

export function Link({ to, children, icon: Icon }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
          isActive
            ? "bg-surface text-white"
            : "text-muted hover:bg-surface hover:text-white"
        }`
      }
    >
      <Icon className="h-5 w-5 shrink-0" />

      <span>{children}</span>
    </NavLink>
  );
}