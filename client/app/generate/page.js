"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Divider,
  Tab,
} from "@mui/material";
import {
  TabList,
  TabPanel,
  TabContext,
} from '@mui/lab'
import {
  doc,
  collection,
  setDoc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import InputField from "../components/inputField";
import FlashcardForm from "../components/flashcardForm";

export default function Generate() {
  const { user } = useUser(); 
  const router = useRouter(); 
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [flipped, setFlipped] = useState({});
  const [error, setError] = useState("");

  const handleTabChange = (event, newTab) => {
    event.preventDefault();
    setFormData({});
    setTabName(newTab);
  }

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const checkSubscriptionStatus = async (userId) => {
    try {
      // Fetch the user's document from the "users" collection
      const userDocRef = doc(db, "users", userId); // Reference to the user document
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        throw new Error("User not found in the database.");
      }
  
      const userData = userDocSnap.data();
      const customerId = userData.stripeCustomerId; // Assuming you stored the Stripe customer ID directly
  
      // Call backend to check the subscription status
      const response = await fetch(`/api/check-subscription?customerId=${customerId}`);
      const data = await response.json();
  
      return data.isSubscribed; // Return subscription status
      } catch (error) {
        console.error("Error checking subscription status:", error);
      return false; // Default to false if there's an error
    }
  };
  
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

  const handleCardClick = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Container maxWidth="100%" sx={{ backgroundImage: "linear-gradient(to top,rgb(58, 58, 58), rgb(30, 30, 30))", height: "100vh", overflowY: 'auto' }}>
      <Header />
      <Container maxWidth="md" sx={{ p: 5, mt: 10 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="white">
          Generate Flashcards
        </Typography>
        <FlashcardForm setFlashcards={setFlashcards} setFlipped={setFlipped} />

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" color="white" sx={{ mb: 3 }}>
              Generated Flashcards
            </Typography>
            <Divider />
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "240px",
                          perspective: "1000px",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            transformStyle: "preserve-3d",
                            transition: "transform 0.6s",
                            transform: flipped[index]
                              ? "rotateY(180deg)"
                              : "rotateY(0deg)",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backfaceVisibility: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#fff",
                              border: "1px solid #ddd",
                              padding: 2,
                              textAlign: "center",
                            }}
                          >
                            <Typography component="div">
                              {flashcard.front || "Front not available"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ddd",
                              padding: 2,
                              textAlign: "center",
                            }}
                          >
                            <Typography component="div">
                              {flashcard.back || "Back not available"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Save Flashcards
            </Button>
          </Box>
        )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
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
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Container>
  );
}
