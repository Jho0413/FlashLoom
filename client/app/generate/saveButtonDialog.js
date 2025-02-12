import { useSession } from "@clerk/nextjs";
import { 
    Box, 
    Button, 
    Dialog, 
    DialogContent, 
    DialogContentText, 
    DialogTitle,
    DialogActions,
    TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import SuccessModal from "./successModal";

const SaveButtonDialog = ({ flashcards, setError, setLoading }) => {
  const { session } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const saveFlashcardSet = async () => {
    const token = await session.getToken();
    const response = await fetch("/api/flashcards/save", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        flashcards: flashcards, 
      }),
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) 
      throw new Error("Unable to save flashcards");

    const data = await response.json();
    return data.id;
  }
  
  const mutation = useMutation({
    mutationFn: saveFlashcardSet,
    mutationKey: [session.user.id, "flashcards"],
    onSuccess: (id) => {
      if (queryClient.getQueryData([session.user.id, "flashcards"]))
        queryClient.setQueryData([session.user.id, "flashcards"], (oldFlashcards) => {
          oldFlashcards.unshift({ id: id, name: name });
          return oldFlashcards;
        });
      setSaved(true);
      setSuccess(true);
    },
    onError: () => setError(true),
    onSettled: () => {
      setDialogOpen(false);
      setName("");
      setLoading(false);
    }
  });

  const saveFlashcards = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }

    setLoading(true);
    setNameError(false);
    mutation.mutate();
  };

  if (flashcards.length == 0)
    return <div></div>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDialogOpen(true)}
        disabled={saved}
      >
        Save Flashcards
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText 
            sx={{ 
              color: nameError ? "red" : "", 
              fontWeight: nameError ? "700" : "700" 
            }}
          >
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            color={nameError ? "error" : "primary"}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <SuccessModal success={success} setSuccess={setSuccess}/>
    </Box>
  );
}

export default SaveButtonDialog;