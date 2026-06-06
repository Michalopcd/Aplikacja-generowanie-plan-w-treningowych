type Props = React.HTMLAttributes<HTMLDivElement>;

export function Card({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        p-4
        ${className}
      `}
    >
      {children}
    </div>
  );
}