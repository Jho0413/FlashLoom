import formatUnixToDate from "@/utils/convertUNIXToDate";
import { useUser } from "@clerk/nextjs";
import { Box, Divider, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import CancelSubscriptionAction from "./cancelSubscriptionAction";
import LoadingPage from "../common/loadingPage";
import ErrorPage from "../common/errorPage";

const SubscriptionPage = () =>{
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        height: "100%",
        width: "100%"
      }}
    >
      <Box sx={{ pb: "1rem" }}>
        <Typography fontSize="1.0625rem" fontWeight="700" color="rgb(33, 33, 38)">
          Subscription
        </Typography>
      </Box>
      <SubscriptionPageDivider />
      <SubscriptionPageBody />
    </Box>
  )
}

const SubscriptionPageBody = () => {
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
    queryKey: [user.id, "subscriptionData"],
    queryFn: fetchSubscriptionData,
    staleTime: 1000 * 60 * 60,
  });

  if (isPending) {
    return (
      <Box sx={{ mt: "2rem" }}>
        <LoadingPage colour="inherit" size="2rem"/>
      </Box>
    )
  }

  if (isError) {
    return <ErrorPage titleSize="h6" disableButton />;
  }

  const { plan, generations, cancelled, subscriptionEndTime } = subscriptionData;
  const subscriptionDate = subscriptionEndTime ? formatUnixToDate(subscriptionEndTime) : "";
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <SubscriptionPageSection
        subheader="Subscription Plan"
        content1={plan}
        content2={plan == "Free" ? `${3 - generations} generations left` : ""}
      />
      <SubscriptionPageDivider />
      <SubscriptionPageSection
        subheader={cancelled ? "Subscription End Date" : "Next Payment Date"}
        content1={subscriptionDate}
      />
      <SubscriptionPageDivider />
      <SubscriptionPageSection
        subheader="Cancel Subscription"
        content1={<CancelSubscriptionAction cancelled={false} />}
        lastRow
        flexContent1={2}
      />
    </Box>
  )
}

const SubscriptionPageSection = ({ subheader, content1, content2, lastRow, flexContent1 }) => {
  return (
    <Box sx={{ display: "flex", pt: "1.4rem", pb: "1.4rem" }}>
      <SubscriptionPageContent content={subheader} />
      <SubscriptionPageContent content={content1} flex={flexContent1} />
      {!lastRow && <SubscriptionPageContent content={content2} />}
    </Box>
  )
}

const SubscriptionPageContent = ({ content, flex }) => {
  if (typeof content === "string")
    return (
      <Typography fontSize="0.8125rem" fontWeight="500" color="rgb(33, 33, 38)" flex={flex ? flex : 1}>
        {content}
      </Typography>
    )
  else {
    return <Box flex={flex ? flex : 1}>{content}</Box>
  }
}

const SubscriptionPageDivider = () => {
  return <Divider sx={{ fontSize: "1px", backgroundColor: "rgba(0, 0, 0, 0.07)" }}/>;
}

export default SubscriptionPage;