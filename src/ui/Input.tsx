type Props =
  React.InputHTMLAttributes<HTMLInputElement>;

export function Input({
  className = "",
  ...props
}: Props) {
  return (
    <input
      {...props}
      className={`
        rounded-lg
        border
        border-zinc-700
        bg-zinc-900
        px-3
        py-2
        text-white
        outline-none
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    />
  );
}