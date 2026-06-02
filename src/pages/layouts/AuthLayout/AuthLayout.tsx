type Props = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        {children}
      </div>
    </div>
  );
}