"use client";

import { useRouter } from "next/navigation";
import Button from "../ui/Button";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-5">
      <div className="w-full max-w-[440px] rounded-xl border border-hairline bg-surface p-10 text-center">
        <span className="mono-label text-danger">error</span>
        <h1 className="mt-3 text-[26px] font-semibold tracking-[-0.02em] text-ink">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-[320px] text-pretty text-[14px] text-ink-muted">
          We hit an issue loading this. Please try again in a moment.
        </p>
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={() => router.push("/")}>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
