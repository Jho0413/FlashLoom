"use client"

import { Container, Typography, Divider, Box } from "@mui/material";
import React, { useState } from "react";
import FlashcardForm from "./flashcardForm";
import FlashCardList from "./flashcardList";
import SaveButtonDialog from "./saveButtonDialog";
import ErrorModal from "../components/common/errorModal";
import LoadingModal from "../components/common/loadingModal";
import { useUser } from "@clerk/nextjs";
import LoadingPage from "../components/common/loadingPage";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../components/common/errorPage";
import PermissionDialog from "./permissionDialog";

const GenerateFlashcardBody = () => {

  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flippedStates, setFlippedStates] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSubscriptionData = async () => {
    const response = await fetch(`/api/stripe-subscription/subscription?userId=${user?.id}`, {
      cache: "default",
    });

    if (!response.ok) {
        throw new Error("Unable to find subscription information");
    }
    const data = await response.json();
    return data;
  }

  const { isPending, isError, data: subscriptionData } = useQuery({
    queryKey: [user?.id, "subscriptionData"],
    queryFn: fetchSubscriptionData,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60,
  });

  if (!isLoaded || isPending) {
    return <LoadingPage />
  }

  if (!isSignedIn) {
    // session timeout
  }

  if (isError) {
    return <ErrorPage />
  }

  if (!subscriptionData.access) {
    return <PermissionDialog />
  }

  return (
    // <Container maxWidth="md" sx={{ p: 5, mt: 10, gap: 5, display: "flex", flexDirection: "column" }}>
    //   <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    //     <Typography
    //       variant="h4"
    //       component="h1"
    //       gutterBottom
    //       fontWeight="bold"
    //       color="white"
    //     >
    //       Generate Flashcards
    //     </Typography>
    //     <Divider sx={{ backgroundColor: "white" }}/>
    //   </Box>
    <Box>
      <FlashcardForm setFlashcards={setFlashcards} setFlippedStates={setFlippedStates} userId={user.id} />
      <FlashCardList flashcards={flashcards} flippedStates={flippedStates} setFlippedStates={setFlippedStates}/>
      <SaveButtonDialog flashcards={flashcards} setError={setError} setLoading={setLoading} userId={user.id} />
      <ErrorModal error={error} setError={setError} />
      <LoadingModal loading={loading} />
      </Box>
    // </Container> 
  );
}

export default GenerateFlashcardBody;