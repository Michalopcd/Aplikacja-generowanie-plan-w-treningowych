type InputProps = {
  placeholder?: string;
};

export function Input({ placeholder }: InputProps) {
  return (
    <input
      placeholder={placeholder}
      className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
    />
  );
}