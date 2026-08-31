"use client";

import { useRouter } from "next/navigation";

export default function AddFlashcardCard() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/generate")}
      className="flex h-[152px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-hairline-strong transition-colors duration-150 hover:bg-surface"
    >
      <span
        aria-hidden="true"
        className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-hairline text-accent"
      >
        +
      </span>
      <span className="text-[13.5px] font-medium text-ink">New set</span>
    </button>
  );
}
