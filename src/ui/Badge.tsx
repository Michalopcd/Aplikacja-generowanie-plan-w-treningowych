type BadgeProps = {
  children: React.ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="rounded-full bg-violet-600 px-3 py-1 text-xs text-white">
      {children}
    </span>
  );
}