"use client";
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { pricingDescriptions } from "../../../utils/pricingDescriptions";
import getStripe from "@/utils/get-stripe";
import { motion } from "framer-motion";
import { useSession } from "@clerk/nextjs";

const PricingGridItem = ({ title, price, description, disabled }) => {
  const { isSignedIn, session } = useSession();
  const router = useRouter();

  const selectPlan = async () => {
    if (disabled) return;

    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    if (title === "Free Trial") {
      router.push("/generate");
      return;
    }
    const token = await session.getToken();
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ plan: title })
    });

    const checkoutSessionJSON = await checkoutSession.json();

    const stripe = await getStripe();
    await stripe.redirectToCheckout({ sessionId: checkoutSessionJSON.id });
  };

  return (
    <Grid
      item
      xs={12}
      md={4}
      lg={4}
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        color: "white",
      }}
    >
      <motion.div
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 280,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            border: "1px solid #333",
            borderRadius: 5,
            backgroundColor: "#1e1e1e",
            cursor: disabled ? null : "pointer",
            "&:hover": {
              backgroundColor: disabled ? "#1e1e1e" : "#292929",
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#5c84f8" }}>
            {title}
          </Typography>
          <Divider sx={{ bgcolor: "#5c84f8", mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>
            {price}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {description}
          </Typography>
          <Button
            variant="contained"
            size="medium"
            onClick={selectPlan}
            sx={{
              backgroundColor: "#5c84f8",
              "&:hover": {
                backgroundColor: disabled ? "#5c84f8" : "#4b72d6",
              },
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            Choose {title}
          </Button>
        </Box>
      </motion.div>
    </Grid>
  );
};

const PricingGrid = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        py: 5,
        px: isSmallScreen ? 2 : 5,
        backgroundColor: "#121212",
        borderRadius: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: "#5c84f8",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Pricing
      </Typography>
      <Grid container spacing={3}>
        {pricingDescriptions.map((pricing) => (
          <PricingGridItem key={pricing.title} {...pricing} />
        ))}
      </Grid>
    </Box>
  );
};

export default PricingGrid;
