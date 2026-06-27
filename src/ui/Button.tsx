type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "success" | "warning";
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
  };

  return (
    <button
      {...props}
      className={`
        rounded-xl
        px-4
        py-2
        text-white
        transition
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
} 