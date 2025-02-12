"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fade, Grid, Card, IconButton, CardActionArea, CardContent, Typography, Modal, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";

const FlashcardCard = ({ id, name, setLoading, setError }) => {
  const { session } = useSession();
  const [confirmation, setConfirmation] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const deleteFlashcardSet = async () => {
    setConfirmation(false);
    setLoading(true);
    const token = await session.getToken();
    const response = await fetch("/api/flashcards/delete", {
      method: "POST",
      body: JSON.stringify({
        flashcardId: id,
      }),
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) 
      throw new Error("Unable to delete flashcard set");
    return id;
  }
  
  const mutation = useMutation({
    mutationFn: deleteFlashcardSet,
    mutationKey: [session?.user?.id, "flashcards"],
    onSuccess: (id) => {
      queryClient.setQueryData([session?.user?.id, "flashcards"], (oldFlashcards) => {
        return oldFlashcards?.filter((flashcard) => flashcard.id !== id)
      });
    },
    onError: () => setError(true),
    onSettled: () => setLoading(false),
  });
  
  return (
    <Fade in timeout={200}>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ position: "relative", minHeight: 200 }}>
          <IconButton
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              zIndex: 2
            }}
            onClick={() => setConfirmation(true)}
          >
            <DeleteIcon />
          </IconButton>
          <CardActionArea sx={{ minHeight: 200 }} onClick={() => router.push(`/flashcard?id=${id}&name=${name}`)}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
              }}
            >
              <Typography variant="h6">{name}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Modal 
          open={confirmation}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: "white",
              paddingX: 4,
              paddingY: 3,
              borderRadius: 5,
            }}
          >
            <Typography>Are you sure you want to delete the set: {name}?</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                gap: 1,
              }}
            >
              <Button 
                variant="contained" 
                color="error"
                onClick={() => mutation.mutate(name)}
              >
                Delete
              </Button>
              <Button 
                variant="text" 
                color="inherit"
                onClick={() => setConfirmation(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Grid>
    </Fade>
  )
}

export default FlashcardCard;