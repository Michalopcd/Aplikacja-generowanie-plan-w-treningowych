type Props =
  React.HTMLAttributes<HTMLHeadingElement>;

export function SectionTitle({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <h2
      {...props}
      className={`
        text-2xl
        font-bold
        text-white
        ${className}
      `}
    >
      {children}
    </h2>
  );
}