import {
  Container,
} from "@mui/material";
import Header from "../components/header";
import GenerateFlashcardBody from "./generateFlashcardBody";
import PermissionDialog from "./permissionDialog";

export default async function GeneratePage({ searchParams }) {
  const { userId } = searchParams;
  let userAccess;
  let userPlan;

  try {
    const response = await fetch(`http://localhost:3000/api/stripe-subscription?userId=${userId}`,
      {
        method: "GET",
        headers: { "Cache-Control": "no-cache" }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get subscription");
    }
    const data = await response.json();
    console.log(data);
    const { access, plan } = data;
    userAccess = access;
    userPlan = plan;

  } catch (error) {
    console.error("Hello");
  }

  return (
    <Container maxWidth="100%" sx={{ backgroundImage: "linear-gradient(to top,rgb(58, 58, 58), rgb(30, 30, 30))", height: "100vh", overflowY: 'auto' }}>
      <Header />
      <GenerateFlashcardBody />
      <PermissionDialog access={userAccess}/>
    </Container>
  );
}