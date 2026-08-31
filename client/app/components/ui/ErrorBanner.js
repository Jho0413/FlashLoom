import { cn } from "./cn";

export default function ErrorBanner({ children, className }) {
  if (!children) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-start gap-2 rounded border border-danger-border bg-danger-bg px-[13px] py-[10px] text-[13px] text-danger",
        className
      )}
    >
      <span className="font-mono leading-[1.5]" aria-hidden="true">
        !
      </span>
      <span className="leading-[1.5]">{children}</span>
    </div>
  );
}
