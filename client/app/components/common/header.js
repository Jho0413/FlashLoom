"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { cn } from "../ui/cn";
import ThemeToggle from "./themeToggle";

const LINKS = [
  { label: "generate", href: "/generate" },
  { label: "library", href: "/flashcards" },
  { label: "subscription", href: "/subscription" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-[10px]" aria-label="FlashLoom home">
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
  );
}

function AuthButtons({ onNavigate }) {
  return (
    <>
      <SignedOut>
        <Link
          href="/sign-in"
          onClick={onNavigate}
          className="rounded-sm border border-hairline-strong px-3 py-2 text-[13px] font-medium text-ink hover:bg-surface"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          onClick={onNavigate}
          className="rounded-sm bg-accent px-[14px] py-[9px] text-[13px] font-semibold text-accent-ink hover:brightness-[1.08]"
        >
          Sign up
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton appearance={{ elements: { userButtonAvatarBox: "h-7 w-7" } }} />
      </SignedIn>
    </>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-nav">
      <div className="flex items-center justify-between px-10 py-[18px] max-[600px]:px-5">
        <Logo />

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-6 w-6 flex-col items-center justify-center gap-[5px]"
          >
            <span className="h-px w-5 bg-ink" />
            <span className="h-px w-5 bg-ink" />
            <span className="h-px w-5 bg-ink" />
          </button>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b pb-[3px] font-mono text-[13px] lowercase transition-colors",
                    active
                      ? "border-accent text-ink"
                      : "border-transparent text-ink-muted hover:text-ink"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
          <div className="flex items-center gap-3 border-l border-rule pl-[22px]">
            <AuthButtons />
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-rule bg-nav md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className="flex h-14 items-center justify-between border-b border-rule px-5 font-mono text-[13px] lowercase text-ink"
            >
              {link.label}
              <span aria-hidden="true" className="text-ink-faint">
                &rarr;
              </span>
            </Link>
          ))}
          <div className="flex h-14 items-center gap-3 px-5">
            <AuthButtons onNavigate={closeMobile} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
