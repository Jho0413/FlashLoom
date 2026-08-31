"use client";

import Link from "next/link";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import PageShell from "../components/common/pageShell";
import LoadingPage from "../components/common/loadingPage";
import ErrorPage from "../components/common/errorPage";
import SessionModal from "../components/common/sessionModal";
import FlashcardList from "../generate/flashcardList";

export default function FlashcardSetPage({ searchParams }) {
  const { isLoaded, session } = useSession();
  const { id, name } = searchParams;

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
      <h1 className="mt-3 text-pretty text-[32px] font-semibold tracking-[-0.03em] text-ink">{title}</h1>
      <p className="mt-1 text-[14.5px] text-ink-muted">{cards.length} cards</p>

      <div className="mt-8">
        <FlashcardList flashcards={cards} />
      </div>
    </PageShell>
  );
}
