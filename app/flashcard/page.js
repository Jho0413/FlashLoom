"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import PageShell from "../components/common/pageShell";
import LoadingPage from "../components/common/loadingPage";
import ErrorPage from "../components/common/errorPage";
import SessionModal from "../components/common/sessionModal";
import { cn } from "../components/ui/cn";
import FlashcardList from "../generate/flashcardList";
import StudyView from "./studyView";

const VIEWS = [
  { key: "grid", label: "Grid" },
  { key: "study", label: "Study" },
];

export default function FlashcardSetPage({ searchParams }) {
  const { isLoaded, session } = useSession();
  const { id, name } = searchParams;
  const [view, setView] = useState("grid");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("flashloom:setview");
      if (stored === "grid" || stored === "study") setView(stored);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const changeView = (next) => {
    setView(next);
    try {
      localStorage.setItem("flashloom:setview", next);
    } catch {
      /* storage unavailable */
    }
  };

  const { isPending, isError, data } = useQuery({
    queryKey: [session?.user?.id, "flashcards", id],
    queryFn: async () => {
      const token = await session.getToken();
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to fetch flashcard set");
      return response.json();
    },
    enabled: !!session,
    staleTime: Infinity,
  });

  if (!isLoaded || (session && isPending)) return <LoadingPage />;
  if (!session) return <SessionModal sessionExpired />;
  if (isError) return <ErrorPage />;

  const cards = data.flashcards || [];
  const title = data.name || name || "Flashcard set";

  return (
    <PageShell width="library">
      <Link href="/flashcards" className="mono-meta text-ink-faint hover:text-ink">
        &larr; library
      </Link>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-pretty text-[32px] font-semibold tracking-[-0.03em] text-ink">{title}</h1>
          <p className="mt-1 text-[14.5px] text-ink-muted">{cards.length} cards</p>
        </div>
        {cards.length > 0 ? (
          <div className="inline-flex shrink-0 rounded-md border border-hairline p-[3px]">
            {VIEWS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => changeView(option.key)}
                aria-pressed={view === option.key}
                className={cn(
                  "rounded-[5px] px-3 py-[5px] text-[12px] font-medium transition-colors",
                  view === option.key ? "bg-surface-sunken text-ink" : "text-ink-muted hover:text-ink"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        {view === "study" && cards.length > 0 ? (
          <StudyView cards={cards} />
        ) : (
          <FlashcardList flashcards={cards} />
        )}
      </div>
    </PageShell>
  );
}
