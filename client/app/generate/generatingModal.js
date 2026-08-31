"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../components/ui/cn";

const STEPS = ["Reading your material", "Finding what's testable", "Writing question and answer pairs"];
const PROGRESS = [12, 55, 92];

export default function GeneratingModal({ open }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      return undefined;
    }
    const timers = [
      setTimeout(() => setStep(1), 7000),
      setTimeout(() => setStep(2), 16000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 max-[600px]:items-end max-[600px]:p-0">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Generating flashcards"
        className="relative w-full max-w-[460px] rounded-xl border border-hairline bg-surface p-6.5 shadow-dialog max-[600px]:rounded-b-none max-[600px]:rounded-t-xl"
      >
        <span className="mono-eyebrow text-ink-faint">generating</span>
        <div className="mt-4 h-px w-full bg-rule">
          <div
            className="h-px bg-accent transition-[width] duration-700 ease-out"
            style={{ width: `${PROGRESS[step]}%` }}
          />
        </div>
        <ul className="mt-5 flex flex-col gap-3">
          {STEPS.map((label, index) => {
            const done = index < step;
            const active = index === step;
            return (
              <li key={label} className="flex items-center gap-3 text-[13.5px]">
                {done ? (
                  <span className="flex w-[6px] justify-center font-mono text-accent" aria-hidden="true">
                    ✓
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-[6px] w-[6px] rounded-full",
                      active ? "animate-pulse bg-accent" : "bg-ink-faint/40"
                    )}
                  />
                )}
                <span className={done ? "text-ink-muted" : active ? "text-ink" : "text-ink-faint"}>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-[14px] text-ink-muted">This usually takes 20–40 seconds.</p>
      </div>
    </div>,
    document.body
  );
}
