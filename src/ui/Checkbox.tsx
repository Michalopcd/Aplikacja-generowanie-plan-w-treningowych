type Props =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  };

export function Checkbox({
  label,
  className = "",
  ...props
}: Props) {
  return (
    <label className="flex items-center gap-2 text-white">
      <input
        {...props}
        type="checkbox"
        className={`
          h-4
          w-4
          rounded-full
          border-2
          border-zinc-600
          accent-green-500
          ${className}
        `}
      />

      {label}
    </label>
  );
}