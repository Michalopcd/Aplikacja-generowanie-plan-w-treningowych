type Props = {
  children: React.ReactNode;
};

export function FormError({ children }: Props) {
  return (
    <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
      {children}
    </p>
  );
}