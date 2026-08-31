import { cn } from "./cn";

export default function Shimmer({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block h-[1em] w-full max-w-[160px] animate-pulse rounded-sm bg-surface-sunken", className)}
    />
  );
}
