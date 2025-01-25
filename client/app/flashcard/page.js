"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Container, Typography, Box, Divider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../components/common/loadingPage";
import ErrorPage from "../components/common/errorPage";
import FlashCardList from "../generate/flashcardList";

export default function Flashcard({ searchParams }) {
  const { isLoaded, user } = useUser();
  const { id: flashcardSetId } = searchParams;
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

  const { name, flashcards } = data;

  return (
    <Container maxWidth="md" sx={{ p: 5, mt: 10, gap: 5, display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight="bold"
          color="white"
        >
          {name}
        </Typography>
        <Divider sx={{ backgroundColor: "white" }}/>
      </Box>
      <FlashCardList flashcards={flashcards} flippedStates={flippedStates} setFlippedStates={setFlippedStates}/>
    </Container> 
  )
}
