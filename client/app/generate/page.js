"use client"

import { Container, Typography, Divider, Box } from "@mui/material";
import React, { useState } from "react";
import FlashcardForm from "./flashcardForm";
import FlashCardList from "./flashcardList";
import SaveButtonDialog from "./saveButtonDialog";
import ErrorModal from "../components/common/errorModal";
import LoadingModal from "../components/common/loadingModal";
import { useSession, useUser } from "@clerk/nextjs";
import LoadingPage from "../components/common/loadingPage";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../components/common/errorPage";
import PermissionDialog from "./permissionDialog";
import SessionModal from "../components/common/sesesionModal";

const GenerateFlashcardBody = () => {

  const { isLoaded, session } = useSession();
  const [flashcards, setFlashcards] = useState([]);
  const [flippedStates, setFlippedStates] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSubscriptionData = async () => {
    const response = await fetch(`/api/stripe-subscription/subscription?userId=${session?.user?.id}`, {
      cache: "default",
    });

    if (!response.ok) {
        throw new Error("Unable to find subscription information");
    }
    const data = await response.json();
    return data;
  }

  const { isPending, isError, data: subscriptionData } = useQuery({
    queryKey: [session?.user?.id, "subscriptionData"],
    queryFn: fetchSubscriptionData,
    enabled: !!session,
    staleTime: 1000 * 60 * 60,
  });

  if (!isLoaded) {
    return <LoadingPage />
  }

  if (!session) {
    return <SessionModal sessionExpired={!session}/>
  }

  if (isPending) {
    return <LoadingPage />
  }

  if (isError) {
    return <ErrorPage />
  }

  if (!subscriptionData.access) {
    return <PermissionDialog />
  }

  return (
    <Box>
      <FlashcardForm setFlashcards={setFlashcards} setFlippedStates={setFlippedStates} />
      <FlashCardList flashcards={flashcards} flippedStates={flippedStates} setFlippedStates={setFlippedStates}/>
      <SaveButtonDialog flashcards={flashcards} setError={setError} setLoading={setLoading} />
      <ErrorModal error={error} setError={setError} />
      <LoadingModal loading={loading} />
    </Box>
  );
}

export default GenerateFlashcardBody;