'use client'

import { Box, Tab, Button, Typography, Container } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import InputField from "../components/flashcards/inputField";
import { useState, useEffect, useRef } from "react";
import LoadingModal from "../components/common/loadingModal";
import ErrorModal from "../components/common/errorModal";
import { useQueryClient } from "@tanstack/react-query";
import PermissionDialog from "./permissionDialog";
import { useSession, useUser } from "@clerk/nextjs";
import DropFileInput from "./dropFileInput";

const FlashcardForm = ({ setFlashcards, setFlippedStates }) => {
  const { session } = useSession();
  const [formData, setFormData] = useState({ message: "" });
  const [tabName, setTabName] = useState("Basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [inputError, setInputError] = useState("");
  const [access, setAccess] = useState(true);
  const queryClient = useQueryClient();

  const isPolling = useRef(true);

  useEffect(() => {
    isPolling.current = true;
    return () => { isPolling.current = false; };
  }, []);

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

  const handleSubmit = async () => {
    // access checking
    const subscriptionData = queryClient.getQueryData([session.user.id, "subscriptionData"]);
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
    newFormData.append("plan", plan);

    const token = await session.getToken();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: newFormData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) 
        throw new Error("Unable to start generation task");

      const { task_id } = await response.json();

      const pollTaskStatus = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/task-status/${task_id}`);
          const data = await response.json();

          if (!isPolling.current) return;

          if (data.status === "SUCCESS") {
            if (plan === "Free") {
              await fetch("/api/increment-generations", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
              });
              queryClient.setQueryData([session.user.id, "subscriptionData"], (oldData) => ({
                ...oldData,
                generations: oldData.generations + 1
              }));
            }
            setFlashcards(JSON.parse(data.flashcards));
            setFlippedStates({});
            isPolling.current = false;
            setLoading(false);
          } else if (data.status === "FAILURE") {
            throw new Error("Task failed: " + data.error); 
          } else {
            setTimeout(pollTaskStatus, 2000);
          }
        } catch (pollErr) {
          console.error("Error polling task:", pollErr);
          setLoading(false);
          setError(true); 
          isPolling.current = false;
        }
      };

      pollTaskStatus();
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setLoading(false);
      setError(true);
    } finally {
      setInputError("");
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
            <DropFileInput formData={formData} setFormData={setFormData} setInputError={setInputError}/>
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