type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "success" | "warning" | "dangerGhost" | "iconGhost";
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const variants = {
    primary: "bg-violet-600 hover:opacity-90",
    success: "bg-green-500 hover:opacity-90",
    warning: "bg-orange-500 hover:bg-orange-600",
    dangerGhost:
      "bg-transparent text-muted hover:bg-red-500/10 hover:text-red-300",
    iconGhost:
      "border border-border bg-card text-white hover:bg-background hover:text-white hover:opacity-100",
  };
  return (
    <button
      {...props}
      className={`
        rounded-xl
        cursor-pointer
        px-4
        py-2
       
        transition
        disabled:cursor-not-allowed
        disabled:opacity-60
        cursor:pointer
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
