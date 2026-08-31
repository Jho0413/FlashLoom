import Link from "next/link";
import { cn } from "./cn";

const BASE =
  "inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap font-sans transition-[background-color,filter,border-color] duration-150 disabled:cursor-not-allowed";

const VARIANTS = {
  primary:
    "rounded bg-accent px-[22px] py-3 text-[14px] font-semibold text-accent-ink hover:brightness-[1.08] disabled:border disabled:border-hairline disabled:bg-surface disabled:text-ink-faint disabled:brightness-100",
  secondary:
    "rounded-sm border border-hairline-strong px-[15px] py-[9px] text-[13.5px] font-medium text-ink hover:bg-surface disabled:border-hairline disabled:text-ink-faint",
  destructive:
    "rounded bg-danger-solid px-[17px] py-[11px] text-[13.5px] font-semibold text-danger-solid-ink hover:brightness-[1.06] disabled:border disabled:border-hairline disabled:bg-surface disabled:text-ink-faint disabled:brightness-100",
};

export default function Button({ variant = "primary", href, type, className, children, ...props }) {
  const classes = cn(BASE, VARIANTS[variant], className);

  if (href) {
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type || "button"} className={classes} {...props}>
      {children}
    </button>
  );
}
