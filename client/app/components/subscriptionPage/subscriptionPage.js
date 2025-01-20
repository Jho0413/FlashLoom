import formatUnixToDate from "@/utils/convertUNIXToDate";
import { useUser } from "@clerk/nextjs";
import { Box, Divider, Typography, Grid, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import CancelSubscriptionAction from "./cancelSubscriptionAction";

const SubscriptionPage = () => {
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
    return <div></div>
  }

  if (isError) {
    return <div>{error.message}</div>
  }

  console.log(subscriptionData);
  const { plan, generations, cancelled, subscriptionEndTime } = subscriptionData;
  const subscriptionDate = subscriptionEndTime ? formatUnixToDate(subscriptionEndTime) : "";
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ pb: "1rem" }}>
        <Typography fontSize="1.0625rem" fontWeight="700" color="rgb(33, 33, 38)">
          Subscription
        </Typography>
      </Box>
      <Divider sx={{ fontSize: "1px", backgroundColor: "rgba(0, 0, 0, 0.07)" }}/>
      <Box sx={{ display: "flex", pt: "1.4rem", pb: "1.4rem", gap: 14 }}>
        <Box sx={{ minWidth: "6rem" }}>
          <Typography fontSize="0.8125rem" fontWeight="500" color="rgb(33, 33, 38)">
            Subscription Plan
          </Typography>
        </Box>
        <Box>
          <Typography fontSize="0.8125rem" fontWeight="500" color="rgb(33, 33, 38)">
            {plan}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize="0.8125rem" fontWeight="500" color="rgb(33, 33, 38)">
            {plan == "Free" ? `${3 - generations} generations left` : ""}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", pt: "1.4rem", pb: "1.4rem", gap: 14 }}>
        <Box sx={{ minWidth: "6rem" }}>
          <Typography fontSize="0.8125rem" fontWeight="500" color="rgb(33, 33, 38)">
            {cancelled ? "Subscription End Date" : "Next Payment Date"}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontSize="0.8125rem" fontWeight="500" color="rgb(33, 33, 38)">
            {subscriptionDate}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", pt: "1.4rem", pb: "1.4rem", gap: 14 }}>
        <Box sx={{ minWidth: "6rem" }}>
          <Typography fontSize="0.8125rem" fontWeight="500" color="rgb(33, 33, 38)">
            Cancel Subscription
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <CancelSubscriptionAction cancelled={cancelled}/>
        </Box>
      </Box>
    </Box>
  )
}

export default SubscriptionPage;