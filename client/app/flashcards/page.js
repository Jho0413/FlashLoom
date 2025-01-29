"use client"

import { useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { Box, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../components/common/loadingPage";
import ErrorPage from "../components/common/errorPage";
import ErrorModal from "../components/common/errorModal";
import LoadingModal from "../components/common/loadingModal";
import FlashcardCard from "./flashcardCard";
import AddFlashcardCard from "./addFlashcardCard";
import SessionModal from "../components/common/sessionModal";

const Flashcards = () => {
  const { isLoaded, session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchFlashcards = async () => {
    const response = await fetch(`/api/flashcards?userId=${session?.user?.id}`);
    if (!response.ok) 
      throw new Error("Unable to fetch flashcards");
    const data = await response.json();
    return data.flashcards;
  }

  const { isPending, isError, data: flashcards } = useQuery({
    queryKey: [session?.user?.id, "flashcards"],
    queryFn: fetchFlashcards,
    enabled: !!session,
    staleTime: 60 * 5 * 1000, 
  });

  if (!isLoaded) {
    return <LoadingPage />
  }

  if (!session) {
    return <SessionModal sessionExpired={!session} />
  }

  if (isPending) {
    return <LoadingPage />
  }

  if (isError) {
    return <ErrorPage />
  }

  return (
    <Box>
      <FlashcardsContent flashcards={flashcards} setLoading={setLoading} setError={setError}/>
      <LoadingModal loading={loading} />
      <ErrorModal error={error} setError={setError} />
    </Box>
  )
}

const FlashcardsContent = ({ flashcards, setLoading, setError }) => {
  return (
    <Grid container spacing={3} >
      {flashcards.length > 0 && flashcards.map(({ id, name }) => 
        <FlashcardCard key={id} id={id} name={name} setLoading={setLoading} setError={setError}/>
      )}
      <AddFlashcardCard />
    </Grid>
  )
}

export default Flashcards;