type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "success";
};

export function Button({ children, variant = "primary" }: ButtonProps) {
  const variants = {
    primary: "bg-violet-600 hover:opacity-90",
    success: "bg-green-500 hover:opacity-90",
    warning: "bg-orange-500 hover:bg-orange-600",
  };

  return (
    <button
      className={`
        rounded-xl
        px-4
        py-2
        text-white
        transition
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
}