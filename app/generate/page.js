"use client";

import { useCallback, useRef, useState } from "react";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import PageShell from "../components/common/pageShell";
import LoadingPage from "../components/common/loadingPage";
import LoadingModal from "../components/common/loadingModal";
import ErrorPage from "../components/common/errorPage";
import ErrorModal from "../components/common/errorModal";
import SessionModal from "../components/common/sessionModal";
import Button from "../components/ui/Button";
import FlashcardForm from "./flashcardForm";
import FlashcardList from "./flashcardList";
import GeneratingModal from "./generatingModal";
import SaveButtonDialog from "./saveButtonDialog";
import PermissionDialog from "./permissionDialog";

const PREVIEW_COUNT = 6;

export default function GeneratePage() {
  const { isLoaded, session } = useSession();
  const [flashcards, setFlashcards] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [canRegenerate, setCanRegenerate] = useState(false);
  const [blocked, setBlocked] = useState(null);
  const submitRef = useRef(null);

  const fetchSubscription = async () => {
    const token = await session.getToken();
    const response = await fetch("/api/stripe-subscription/subscription", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to load subscription information");
    return response.json();
  };

  const { isPending, isError, data: subscription } = useQuery({
    queryKey: [session?.user?.id, "subscriptionData"],
    queryFn: fetchSubscription,
    enabled: !!session,
    staleTime: 1000 * 60 * 60,
  });

  const handleGenerated = useCallback((cards) => {
    setFlashcards(cards);
    setExpanded(false);
  }, []);

  if (!isLoaded || (session && isPending)) return <LoadingPage />;
  if (!session) return <SessionModal sessionExpired />;
  if (isError) return <ErrorPage />;

  const showPill = subscription.plan === "Free";
  const visible = expanded ? flashcards : flashcards.slice(0, PREVIEW_COUNT);
  const remaining = flashcards.length - visible.length;

  return (
    <PageShell width="generate" pt="pt-13">
      <div className="flex items-start justify-between gap-4 max-[600px]:flex-col">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-ink">Generate flashcards</h1>
          <p className="mt-1 text-[14.5px] text-ink-muted">
            Turn text, a PDF, or a YouTube lecture into a study set.
          </p>
        </div>
        {showPill ? (
          <span className="flex shrink-0 items-center gap-2 rounded-[999px] border border-hairline px-[13px] py-2 text-[13px] text-ink-muted">
            <span className="h-[5px] w-[5px] rounded-full bg-accent" aria-hidden="true" />
            {Math.max(0, 3 - subscription.generations)} of 3 free generations left
          </span>
        ) : null}
      </div>

      {subscription.access ? (
        <>
          <div className="mt-8">
            <FlashcardForm
              subscription={subscription}
              onGenerated={handleGenerated}
              setGenerating={setGenerating}
              setError={setError}
              submitRef={submitRef}
              onCanSubmitChange={setCanRegenerate}
              onAccessBlocked={setBlocked}
            />
          </div>

          {flashcards.length > 0 ? (
            <section className="mt-14">
              <div className="flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-[30px] font-semibold tracking-[-0.025em] text-ink">Results</h2>
                  <span className="mono-meta text-ink-faint">
                    {flashcards.length} cards · click to flip
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    disabled={!canRegenerate}
                    onClick={() => submitRef.current?.()}
                  >
                    Regenerate
                  </Button>
                  <SaveButtonDialog
                    flashcards={flashcards}
                    setError={setError}
                    setLoading={setSaving}
                    onReset={() => setFlashcards([])}
                  />
                </div>
              </div>

              <div className="mt-6">
                <FlashcardList flashcards={visible} />
              </div>

              {remaining > 0 ? (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="mono-meta text-ink-muted hover:text-ink"
                  >
                    {remaining} more cards
                  </button>
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      ) : (
        <PermissionDialog open reason={subscription.plan === "Free" ? "limit" : "lapsed"} />
      )}

      <GeneratingModal open={generating} />
      <LoadingModal loading={saving} />
      <ErrorModal error={error} setError={setError} />
      <PermissionDialog
        open={Boolean(blocked)}
        reason={blocked || "limit"}
        onClose={() => setBlocked(null)}
      />
    </PageShell>
  );
}
