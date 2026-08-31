"use client";

import { useState } from "react";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import PageShell from "../components/common/pageShell";
import LoadingPage from "../components/common/loadingPage";
import LoadingModal from "../components/common/loadingModal";
import ErrorPage from "../components/common/errorPage";
import ErrorModal from "../components/common/errorModal";
import SessionModal from "../components/common/sessionModal";
import FlashcardCard from "./flashcardCard";
import AddFlashcardCard from "./addFlashcardCard";
import EmptyState from "./emptyState";

export default function FlashcardsPage() {
  const { isLoaded, session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { isPending, isError, data: sets } = useQuery({
    queryKey: [session?.user?.id, "flashcards"],
    queryFn: async () => {
      const token = await session.getToken();
      const response = await fetch("/api/flashcards", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to fetch flashcards");
      const data = await response.json();
      return [...data.flashcards].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
    },
    enabled: !!session,
    staleTime: 60 * 5 * 1000,
  });

  if (!isLoaded || (session && isPending)) return <LoadingPage />;
  if (!session) return <SessionModal sessionExpired />;
  if (isError) return <ErrorPage />;

  const totalCards = sets.reduce((sum, set) => sum + (set.cardCount ?? 0), 0);

  return (
    <PageShell width="library">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-ink">My Flashcards</h1>
          <p className="mt-1 text-[14.5px] text-ink-muted">
            {sets.length} saved {sets.length === 1 ? "set" : "sets"} · {totalCards} cards
          </p>
        </div>
        {sets.length > 0 ? <span className="mono-meta text-ink-faint">sorted by recent</span> : null}
      </div>

      <div className="mt-8">
        {sets.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {sets.map((set) => (
              <FlashcardCard key={set.id} {...set} setLoading={setLoading} setError={setError} />
            ))}
            <AddFlashcardCard />
          </div>
        )}
      </div>

      <LoadingModal loading={loading} />
      <ErrorModal error={error} setError={setError} />
    </PageShell>
  );
}
