"use client"

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Container, Box, Grid, Typography, Divider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../components/common/loadingPage";
import ErrorPage from "../components/common/errorPage";
import ErrorModal from "../components/common/errorModal";
import LoadingModal from "../components/common/loadingModal";
import FlashcardCard from "./flashcardCard";
import AddFlashcardCard from "./addFlashcardCard";

const Flashcards = () => {
  const { isLoaded, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchFlashcards = async () => {
    const response = await fetch(`/api/flashcards?userId=${user?.id}`);
    if (!response.ok) 
      throw new Error("Unable to fetch flashcards");
    const data = await response.json();
    return data.flashcards;
  }

  const { isPending, isError, data: flashcards } = useQuery({
    queryKey: [user?.id, "flashcards"],
    queryFn: fetchFlashcards,
    enabled: !!user?.id,
    staleTime: 60 * 5 * 1000, 
  });

  if (!isLoaded || isPending) {
    return <LoadingPage />
  }

  if (isError) {
    return <ErrorPage />
  }

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        p: 5, 
        mt: 10, 
        display: "flex", 
        flexDirection: "column", 
        gap: 5 
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
          Your Flashcards
        </Typography>
        <Divider sx={{ backgroundColor: "white" }}/>
      </Box>
      <FlashcardsContent flashcards={flashcards} setLoading={setLoading} setError={setError} userId={user.id}/>
      <LoadingModal loading={loading} />
      <ErrorModal error={error} setError={setError} />
    </Container>  
  )
}

const FlashcardsContent = ({ flashcards, setLoading, setError, userId }) => {
  return (
    <Grid container spacing={3} >
      {flashcards.length > 0 && flashcards.map(({ id, name }) => 
        <FlashcardCard key={id} id={id} name={name} setLoading={setLoading} setError={setError} userId={userId}/>
      )}
      <AddFlashcardCard />
    </Grid>
  )
}

export default Flashcards;