type Props =
  React.HTMLAttributes<HTMLDivElement>;

export function Container({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`
        mx-auto
        max-w-5xl
        px-4
        ${className}
      `}
    >
      {children}
    </div>
  );
}