type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ className = "", error, ...props }: Props) {
  return (
    <div className="w-full">
      <input
        {...props}
        className={`
            w-full
            rounded-lg
            border
            bg-zinc-900
            px-3
            py-2
            text-white
            placeholder:text-zinc-400
            outline-none
            transition

          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-zinc-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
          }
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}
        `}
      />

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
