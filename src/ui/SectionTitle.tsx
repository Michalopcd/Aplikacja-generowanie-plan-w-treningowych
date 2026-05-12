type SectionTitleProps = {
  children: React.ReactNode;
};

export function SectionTitle({
  children,
}: SectionTitleProps) {
  return (
    <h2 className="text-2xl font-bold text-white">
      {children}
    </h2>
  );
}