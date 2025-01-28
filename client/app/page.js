"use client";

import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import FeatureGrid from "./components/home/featuresGrid";
import { useRouter } from "next/navigation";
import PricingGrid from "./components/home/pricingGrid";
import FaqSection from "./components/home/faqSection";
import { motion } from "framer-motion";
import SessionModal from "./components/common/sesesionModal";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, session } = useSession();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setLoggedIn(true);
    }

    if (loggedIn && !session) {
      setSessionExpired(true);
    }
  }, [isSignedIn, session, loggedIn]);

  const handleGetStartedClick = () => {
    if (isSignedIn) {
      router.push(`/generate`); // Redirect to Generate page if signed in
    } else {
      router.push("/sign-up"); // Redirect to Sign-up page if not signed in
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 10, pb: 10 }}>
      <Box
        gap={5}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          mt: 10,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Typography variant="h3" fontWeight="700">
            Welcome to FlashLoom
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ m: 3 }}>
            Revolutionize your learning experience with our innovative
            AI-curated interactive flashcards, designed to elevate your
            knowledge retention and engagement!
          </Typography>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ textAlign: "center" }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 5,
              backgroundColor: "#5c84f8",
              "&:hover": {
                backgroundColor: "#4a6abf",
              },
            }}
            onClick={handleGetStartedClick}
          >
            Get Started
          </Button>
        </motion.div>
        <Divider sx={{ borderColor: "white" }} />
        <FeatureGrid />
        <Divider sx={{ borderColor: "white" }} />
        <PricingGrid />
        <Divider sx={{ borderColor: "white" }} />
        <FaqSection />
      </Box>
      <SessionModal sessionExpired={sessionExpired}/>
    </Container>
  );
}
