"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../components/common/loadingPage";
import ErrorPage from "../components/common/errorPage";
import FlashCardList from "../generate/flashcardList";
import PageBodyLayout from "../components/common/pageBodyLayout";

export default function Flashcard({ searchParams }) {
  const { isLoaded, user } = useUser();
  const { id: flashcardSetId, name } = searchParams;
  const [flippedStates, setFlippedStates] = useState({});

  const fetchFlashcardSet = async () => {
    const response = await fetch(`/api/flashcards/${flashcardSetId}?userId=${user?.id}`);
    if (!response.ok)
      throw new Error("Unable to fetch flashcardSet");
    const data = await response.json();
    return data;
  }

  const { isPending, isError, data } = useQuery({
    queryFn: fetchFlashcardSet,
    queryKey: [user?.id, "flashcards", flashcardSetId],
    staleTime: Infinity,
    enabled: !!user?.id,
  });

  if (!isLoaded || isPending) 
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
