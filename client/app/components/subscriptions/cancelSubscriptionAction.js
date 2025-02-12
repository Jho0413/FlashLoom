"use client"

import { useSession } from "@clerk/nextjs";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const CancelSubscriptionAction = ({ cancelled }) => {
  const { session } = useSession();
  const [nextStep, setNextStep] = useState(false);
  const [confirmationValue, setConfirmationValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleTextChange = (event) => {
    event.preventDefault();
    setConfirmationValue(event.target.value);
  }

  const cancelSubscription = async () => {
    setLoading(true);
    const token = await session.getToken();
    try {
      const response = await fetch("/api/stripe-subscription/cancel", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok)
        throw new Error("Failed to cancel subscription");
      setSuccess(true);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const match = confirmationValue == "Cancel Subscription";

  if (!nextStep) {
    return (
      <Button size="small" variant="text" color="error" disabled={cancelled} onClick={() => setNextStep(true)}>
        Cancel Subscription
      </Button>
    )
  }

  if (success) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <CheckCircleIcon sx={{ color: "green" }}/>
        <Typography fontWeight="400" color="rgb(33, 33, 38)" fontSize="0.8125rem" textAlign="center">
          Your subscription has been successfully cancelled. You can still use the plan till the subscription end date.
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <CancelIcon sx={{ color: "red" }}/>
        <Typography fontWeight="400" color="rgb(33, 33, 38)" fontSize="0.8125rem" textAlign="center">
          Sorry there was an issue cancelling your subscription, please try again later.
        </Typography>
      </Box>
    )
  }
  
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="inherit" size={30}/>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        border: "solid 1px rgba(0, 0, 0, 0.07)",
        borderRadius: "0.5rem",
        paddingX: "1.2rem",
        paddingY: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box>
        <Typography fontWeight="700" fontSize="0.8125rem" color="rgb(33, 33, 38)">
          Cancel Subscription
        </Typography>
        <Typography fontWeight="400" color="rgb(116, 118, 134)" fontSize="0.8125rem">
          Are you sure you want to cancel your subscription?
        </Typography>
        <Typography fontWeight="400" color="rgb(239, 68, 68)" fontSize="0.8125rem">
          This action is permanent and irreversible.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}
      >
        <Typography fontWeight="500" fontSize="0.8125rem" color="rgb(33, 33, 38)">
          Type &quot;Cancel Subscription&quot; below to continue
        </Typography>
        <Box>
          <input
            type="text"
            value={confirmationValue}
            onChange={handleTextChange}
            placeholder="Cancel Subscription"
            style={{
              padding: "0.375rem 0.75rem",
              color: "black",
              backgroundColor: "white",
              outline: "transparent solid 2px",
              width: "100%",
              fontWeight: 400,
              fontSize: "0.8125rem",
              border: "solid 1px rgba(0, 0, 0, 0.11)",
              borderRadius: "0.375rem",
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          gap: "1rem",
        }}
      >
        <Button 
          size="small" 
          variant="text" 
          color="error"
          disabled={!match}
          onClick={async () => {
            await cancelSubscription();
          }}
        >
          Cancel Subscription
        </Button>
        <Button 
          size="small" 
          variant="text" 
          color="grey" 
          onClick={() => { 
            setNextStep(false);
            setConfirmationValue("");
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  )
}

export default CancelSubscriptionAction;