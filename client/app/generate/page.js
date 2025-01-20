"use client"

import { Box } from "@mui/material";
import GenerateFlashcardBody from "./generateFlashcardBody";
import PermissionDialog from "./permissionDialog";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import ErrorPage from "../components/errorPage";
import LoadingPage from "../components/loadingPage";

const GeneratePage = () => {
  const { user } = useUser();

  const fetchSubscriptionData = async () => {
    const response = await fetch(`/api/stripe-subscription/subscription?userId=${user.id}`, {
      cache: "default",
    });

    if (!response.ok) {
        throw new Error("Unable to find subscription information");
    }
    const data = await response.json();
    return data;
  }

  const { isPending, isError, data: subscriptionData, error } = useQuery({
    queryKey: ["subscriptionData"],
    queryFn: fetchSubscriptionData,
    staleTime: 1000 * 60 * 60,
  });

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const { access, plan, generations } = subscriptionData;

  return (
    <Box>
      <GenerateFlashcardBody />
      <PermissionDialog access={access}/>
    </Box>
  );
}

export default GeneratePage;