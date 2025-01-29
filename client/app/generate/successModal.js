import { useRouter } from "next/navigation";
import { Modal, Container, IconButton, Box, Typography, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const SuccessModal = ({ success, setSuccess }) => {
  const router = useRouter();
  return (
    <Modal open={success} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Container 
        maxWidth="xs" 
        sx={{
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: 3,
          position: "relative",
          backgroundColor: '#f9f9f9',
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
            zIndex: 2
          }}
          onClick={() => setSuccess(false)}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ padding: 4 }}>
          <Typography 
            variant="h4"
            gutterBottom
          >
            Successfully saved!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            You can find this in your flashcards
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => router.push("/flashcards")}
            sx={{ marginTop: 2 }}
          >
            Go to Your Flashcards page
          </Button>
        </Box>
      </Container>
    </Modal>
  );
}

export default SuccessModal;