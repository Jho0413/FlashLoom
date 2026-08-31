"use client";

import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import LoadingPage from "../components/common/loadingPage";
import ErrorPage from "../components/common/errorPage";

export default function ResultPage({ searchParams }) {
  const { session_id: sessionId } = searchParams;
  const [status, setStatus] = useState("loading");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    const run = async () => {
      try {
        const response = await fetch(`/api/checkout_sessions?session_id=${sessionId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Checkout lookup failed");
        setPaid(data.payment_status === "paid");
        setStatus("done");
      } catch {
        setStatus("error");
      }
    };
    run();
  }, [sessionId]);

  if (status === "loading") return <LoadingPage />;
  if (status === "error") return <ErrorPage />;

  return (
    <div className="mx-auto max-w-[460px] px-5 pb-23 pt-[120px] text-center">
      <span
        aria-hidden="true"
        className={`mx-auto flex h-[30px] w-[30px] items-center justify-center rounded-full border font-mono text-[14px] ${
          paid ? "border-accent-border text-accent" : "border-danger-border text-danger"
        }`}
      >
        {paid ? "✓" : "!"}
      </span>
      <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.02em] text-ink">
        {paid ? "You’re subscribed" : "Something went wrong"}
      </h1>
      <p className="mx-auto mt-2 max-w-[340px] text-pretty text-[14px] text-ink-muted">
        {paid
          ? "Your payment went through. Your plan is active and ready to use."
          : "Your payment didn’t complete. You can try again from the pricing page."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        {paid ? (
          <Button href="/generate">Go generate flashcards</Button>
        ) : (
          <>
            <Button href="/#pricing">Try again</Button>
            <Button href="/flashcards" variant="secondary">
              Back to library
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
