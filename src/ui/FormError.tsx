type Props = {
  children: React.ReactNode;
};

export function FormError({ children }: Props) {
  return (
    <p className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-base text-red-400">
      {children}
    </p>
  );
}