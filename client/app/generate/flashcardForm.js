'use client'

import { Box, Tab, Button, Typography, Container } from "@mui/material"
import { TabContext, TabPanel, TabList } from "@mui/lab"
import InputField from "../components/flashcards/inputField"
import { useState } from "react"
import { useUser } from "@clerk/nextjs";
import LoadingModal from "../components/common/loadingModal";
import ErrorModal from "../components/common/errorModal";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query"
import PermissionDialog from "./permissionDialog"
import LoadingPage from "../components/common/loadingPage"
import ErrorPage from "../components/common/errorPage"

const FlashcardForm = ({ setFlashcards, setFlippedStates }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({ message: "" });
  const [tabName, setTabName] = useState("Basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [inputError, setInputError] = useState("");
  const [access, setAccess] = useState(true);
  const queryClient = useQueryClient();

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

  const { isPending, isError, data: subscriptionData, error: queryError } = useQuery({
    queryKey: [user.id, "subscriptionData"],
    queryFn: fetchSubscriptionData,
    staleTime: 1000 * 60,
  });

  if (isPending) {
    return <LoadingPage />
  }

  if (isError) {
    return <ErrorPage />
  }

  if (!subscriptionData.access) {
    return <PermissionDialog access={subscriptionData.access}/>
  }

  const handleTabChange = (event, newTab) => {
    event.preventDefault();
    switch (newTab) {
      case "Basic":
        setFormData({ message: "" });
        break;
      case "Youtube":
        setFormData({ message: "", youtube_url: "" });
        break;
      case "PDF":
        setFormData({ file: null, message: "" });
        break;
      default:
        break;
    }
    setInputError("");
    setTabName(newTab);
  }

  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file && file.type && file.type === 'application/pdf') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: file,
      }));
      setInputError("");
    } else {
      setInputError("Please upload a valid PDF file");
    }
  }

  const handleSubmit = async () => {
    // access checking
    const { plan, generations, subscriptionEndTime } = subscriptionData;
    if ((plan !== "Free" || generations >= 3) && (plan === "Free" || Date.now() > subscriptionEndTime)) {
      setAccess(false);
      return;
    }
    const newFormData = new FormData();

    // form validation 
    switch (tabName) {
      case "Basic":
        if (!formData.message.trim()) {
          setInputError("Please fill out all required fields");
          return;
        }
        break;
      case "Youtube":
        if (!formData.youtube_url.trim()) {
          setInputError("Please fill out all required fields");
          return;
        }
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|v\/|embed\/|.+\?v=))([A-Za-z0-9_-]{11})(?:&t=\d+s)?$/;
        if (!regex.test(formData.youtube_url)) {
          setInputError("Please input a valid Youtube URL");
          return;
        }
        newFormData.append("youtube_url", formData.youtube_url);
        break;
      case "PDF":
        if (!formData.file || formData.file.type !== "application/pdf") {
          setInputError("Please upload a valid PDF file");
          return;
        }
        newFormData.append("file", formData.file);
        break;
      default: 
        break;
    }

    // generating flashcards 
    setLoading(true);
    newFormData.append("message", formData.message);
    newFormData.append("method", tabName);
    newFormData.append("userId", user.id);
    newFormData.append("plan", plan);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: newFormData,
      });

      if (!response.ok) 
        throw new Error("Unable to generate flashcards");

      const data = await response.json();
      const { flashcards } = data;
      setFlashcards(JSON.parse(flashcards));
      setFlippedStates({}); 

      // only updating generations if free plan
      if (plan === "Free") {
        queryClient.setQueryData([user.id, "subscriptionData"], (oldData) => {
          return {
            ...oldData, 
            generations: oldData.generations + 1 
          }
        });
      }
    } catch (error) {
      setError(true);
    } finally {
      setInputError("");
      setLoading(false);
    }
  }

  const renderTabContent = () => {
    switch (tabName) {
      case "Basic":
        return (
          <InputField 
            name="message"
            label="Enter your text"
            rows={4}
            value={formData}
            setValue={setFormData}
            required
          />
        );
      case "Youtube":
        return (
          <Box>
            <InputField 
              name="youtube_url"
              label="Enter a youtube url"
              rows={1}
              value={formData}
              setValue={setFormData}
              required
            />
            <InputField 
              name="message"
              label="Enter additional information for better generation (Optional)"
              rows={4}
              value={formData}
              setValue={setFormData}
            />
          </Box>
        );
      case "PDF":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <form>
              <input 
                type="file"
                name="file"
                onChange={handleFileUpload}
              />
            </form>
            <InputField 
              name="message"
              label="Enter additional information for better generation (Optional)"
              rows={4}
              value={formData}
              setValue={setFormData}
              required={false}
            />
          </Box>
        );
      default:
        return null;
    }
  }

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 1,
      }}
    >
      <TabContext value={tabName}>
        <Box>
          <TabList onChange={handleTabChange} variant="fullWidth" centered>
            <Tab label="Basic" value="Basic" sx={{ color: 'white' }} />
            <Tab label="Youtube" value="Youtube" sx={{ color: 'white' }} />
            <Tab label="PDF" value="PDF" sx={{ color: 'white' }} />
          </TabList>
        </Box>
        <TabPanel value={tabName}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {inputError && <Typography fontWeight="bold" color="error">{inputError}</Typography>}
            {renderTabContent()}
          </Box>
        </TabPanel>
      </TabContext>
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          // type="submit"
          onClick={handleSubmit}
        >
          Generate Flashcards
        </Button>
      </Container>
      <LoadingModal loading={loading} />
      <ErrorModal error={error} setError={setError} />
      <PermissionDialog access={access} />
    </Box>
  )
}

export default FlashcardForm;