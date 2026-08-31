import Link from "next/link";
import ThemeToggle from "./themeToggle";

export default function AuthShell({ heading, sub, children }) {
  return (
    <div className="relative grid min-h-screen grid-cols-12 max-[900px]:grid-cols-1">
      <ThemeToggle className="absolute right-5 top-5 z-10 bg-canvas" />
      <aside className="col-span-5 flex flex-col justify-between gap-10 border-r border-rule bg-surface p-10 grid-surface max-[900px]:hidden">
        <Link href="/" className="flex items-center gap-[10px]">
          <span
            aria-hidden="true"
            className="flex h-5 w-5 flex-col items-center justify-center gap-[3px] rounded-[4px] bg-accent"
          >
            <span className="h-px w-[11px] bg-canvas" />
            <span className="h-px w-[11px] bg-canvas" />
            <span className="h-px w-[11px] bg-canvas" />
          </span>
          <span className="text-[15px] font-semibold text-ink">FlashLoom</span>
        </Link>

        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-ink">{heading}</h1>
          <p className="mt-2 max-w-[280px] text-pretty text-[14px] text-ink-muted">{sub}</p>
        </div>

        <div className="rounded-lg border border-hairline bg-surface-sunken p-5">
          <span className="mono-label">Card 01</span>
          <p className="mt-3 text-[15px] font-medium text-ink">
            What process converts light energy into chemical energy in plants?
          </p>
          <span className="mt-3 block font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
            flip &rarr;
          </span>
        </div>
      </aside>

      <main className="col-span-7 flex items-center justify-center bg-canvas p-10 max-[900px]:col-span-1 max-[600px]:p-5">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}
