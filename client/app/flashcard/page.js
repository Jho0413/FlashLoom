"use client";

import { useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../components/common/loadingPage";
import ErrorPage from "../components/common/errorPage";
import FlashCardList from "../generate/flashcardList";
import PageBodyLayout from "../components/common/pageBodyLayout";
import SessionModal from "../components/common/sessionModal";

export default function Flashcard({ searchParams }) {
  const { isLoaded, session } = useSession();
  const { id: flashcardSetId, name } = searchParams;
  const [flippedStates, setFlippedStates] = useState({});

  const fetchFlashcardSet = async () => {
    const response = await fetch(`/api/flashcards/${flashcardSetId}?userId=${session?.user?.id}`);
    if (!response.ok)
      throw new Error("Unable to fetch flashcardSet");
    const data = await response.json();
    return data;
  }

  const { isPending, isError, data } = useQuery({
    queryFn: fetchFlashcardSet,
    queryKey: [session?.user?.id, "flashcards", flashcardSetId],
    staleTime: Infinity,
    enabled: !!session,
  });

  if (!isLoaded) 
    return <LoadingPage />

  if (!session) 
    return <SessionModal sessionExpired={!session}/>
  
  if (isPending) 
    return <LoadingPage />

  if (isError)
    return <ErrorPage />

  const { flashcards } = data;

  return (
    <PageBodyLayout title={name}>
      <FlashCardList flashcards={flashcards} flippedStates={flippedStates} setFlippedStates={setFlippedStates}/>
    </PageBodyLayout>
  )
}
