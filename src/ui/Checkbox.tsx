type CheckboxProps = {
  label: string;
};

export function Checkbox({
  label,
}: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-white">
      <input
        type="checkbox"
        className="
          h-4
          w-4
          rounded-full
          border-2
          border-zinc-600
          accent-green-500
        "
      />

      {label}
    </label>
  );
}