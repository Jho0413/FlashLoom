import { useUser } from "@clerk/nextjs";
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
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { db } from "@/firebase";
import { doc, writeBatch, collection, getDoc } from "firebase/firestore";

const SaveButtonDialog = ({ flashcards }) => {
  const { user } = useUser();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [setName, setSetName] = useState("");

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    if (!user) {
      alert("User not found. Please log in.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      router.push(`/flashcards`);
      setSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  if (flashcards.length == 0)
    return <div></div>;
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDialogOpen(true)}
      >
        Save Flashcards
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SaveButtonDialog;