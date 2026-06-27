type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "primary" | "success" | "warning";
};

export function Badge({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const variants = {
    primary: "bg-violet-600 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-orange-500 text-white",
  };

  return (
    <span
      {...props}
      className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}