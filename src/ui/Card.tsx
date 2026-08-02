import { twMerge } from "tailwind-merge";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Card({
  children,
  className,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={twMerge(
        "rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}