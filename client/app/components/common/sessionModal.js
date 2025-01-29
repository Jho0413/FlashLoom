import { Box, Modal, Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const SessionModal = ({ sessionExpired }) => {

  const router = useRouter();

  return (
    <Modal
      open={sessionExpired}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container 
        maxWidth="xs" 
        sx={{
          textAlign: 'center',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Box>
          <Typography 
            variant="h4"
            color="error" 
            gutterBottom
          >
            Session Timeout :/
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Click here to log in and continue to generate flashcards!
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => router.push("/sign-in")}
          sx={{ marginTop: 2 }}
        >
          Go to Login Page
        </Button>
      </Container>
    </Modal>
  );
}

export default SessionModal;