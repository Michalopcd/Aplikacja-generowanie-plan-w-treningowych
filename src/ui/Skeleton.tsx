type Props = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({
  className = "",
  ...props
}: Props) => {
  return (
    <div
      {...props}
      className={`animate-pulse rounded-lg bg-border ${className}`}
    />
  );
};