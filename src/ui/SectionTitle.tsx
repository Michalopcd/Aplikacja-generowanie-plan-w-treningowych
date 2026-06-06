type SectionTitleProps =
  React.HTMLAttributes<HTMLHeadingElement>;

export function SectionTitle({
  children,
  className = "",
  ...props
}: SectionTitleProps) {
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