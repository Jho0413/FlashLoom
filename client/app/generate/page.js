import {
  Container,
} from "@mui/material";
import Header from "../components/header";
import GenerateFlashcardBody from "./generateFlashcardBody";

export default function GeneratePage() {
  return (
    <Container maxWidth="100%" sx={{ backgroundImage: "linear-gradient(to top,rgb(58, 58, 58), rgb(30, 30, 30))", height: "100vh", overflowY: 'auto' }}>
      <Header />
      <GenerateFlashcardBody />
    </Container>
  );
}