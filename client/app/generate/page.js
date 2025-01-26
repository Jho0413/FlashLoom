"use client"

import { Container, Typography, Divider, Box } from "@mui/material";
import React, { useState } from "react";
import FlashcardForm from "./flashcardForm";
import FlashCardList from "./flashcardList";
import SaveButtonDialog from "./saveButtonDialog";
import ErrorModal from "../components/common/errorModal";
import LoadingModal from "../components/common/loadingModal";

const GenerateFlashcardBody = () => {

  const [flashcards, setFlashcards] = useState([]);
  const [flippedStates, setFlippedStates] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
          Generate Flashcards
        </Typography>
        <Divider sx={{ backgroundColor: "white" }}/>
      </Box>
      <FlashcardForm setFlashcards={setFlashcards} setFlippedStates={setFlippedStates}/>
      <FlashCardList flashcards={flashcards} flippedStates={flippedStates} setFlippedStates={setFlippedStates}/>
      <SaveButtonDialog flashcards={flashcards} setError={setError} setLoading={setLoading}/>
      <ErrorModal error={error} setError={setError} />
      <LoadingModal loading={loading} />
    </Container> 
  );
}

export default GenerateFlashcardBody;