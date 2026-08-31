import { cn } from "./cn";

export default function Spinner({ size = 20, className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-r-transparent opacity-60 align-[-0.125em]",
        className
      )}
    />
  );
}
