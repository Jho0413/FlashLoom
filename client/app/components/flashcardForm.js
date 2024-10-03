'use client'

import { 
    Box,
    Tab,
    Button,
    Modal,
    Typography,
    CircularProgress,
} from "@mui/material"
import {
    TabContext,
    TabPanel,
    TabList
} from "@mui/lab"
import InputField from "./inputField"
import { useEffect, useState } from "react"
import BuildIcon from '@mui/icons-material/Build';

const FlashcardForm = ({ setFlashcards, setFlipped }) => {

    const [formData, setFormData] = useState({});
    const [tabName, setTabName] = useState("Basic");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openError, setOpenError] = useState(false);

    const handleTabChange = (event, newTab) => {
        event.preventDefault();
        setFormData({});
        setTabName(newTab);
    }

    const handleCloseError = () => {
        setOpenError(false);
    }

    useEffect(() => {
        console.log(JSON.stringify(formData))
    }, [formData]);

    const handleSubmit = async () => {
        setLoading(true);
        console.log({...formData});
        try {
            const response = await fetch("/api/generate", {
              method: "POST",
              body: JSON.stringify({...formData, "method": tabName}),
              headers: {
                "Content-Type": "application/json",
              },
            });
       
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error_message);
            }
            console.log("Generated flashcards:", data); 
            console.log(data.flashcards);
       
            if (data.flashcards) {
              setFlipped({});
              setLoading(false);
              setFlashcards(data.flashcards);
            } else {
              console.error("Unexpected response format:", data);
              throw new Error("We have encountered internal errors. Please try again later.");
            }
        } catch (error) {
            console.error("Error generating flashcards:", error);
            setLoading(false);
            setError(error.message);
            setOpenError(true);
        } finally {
          setLoading(false);
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
                <Tab label="Yotube" value="Youtube" sx={{ color: 'white' }} />
                <Tab label="PDF" value="PDF" sx={{ color: 'white' }} />
              </TabList>
            </Box>
            <TabPanel value="Basic">
              <InputField 
                name="message"
                label="Enter your text"
                rows={4}
                value={formData}
                setValue={setFormData}
                required={true}
              />
            </TabPanel>
            <TabPanel value="Youtube">
              <InputField 
                  name="youtube_url"
                  label="Enter a youtube url"
                  rows={1}
                  value={formData}
                  setValue={setFormData}
                  required={true}
              />
              <InputField 
                name="message"
                label="Enter additional information for better generation (Optional)"
                rows={4}
                value={formData}
                setValue={setFormData}
                required={false}
              />
            </TabPanel>
            <TabPanel value="PDF">
              <InputField 
                  name="pdf_file"
                  label="Enter your pdf"
                  rows={4}
                  value={formData}
                  setValue={setFormData}
                  required={true}
              />
              <InputField 
                name="message"
                label="Enter additional information for better generation (Optional)"
                rows={4}
                value={formData}
                setValue={setFormData}
                required={false}
              />
            </TabPanel>
          </TabContext>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
                borderRadius: 10,
            }}
          >
            Generate Flashcards
          </Button>

          <Modal 
            open={loading}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
          >
            <Box 
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    gap: 2,
                    padding: 5,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6">Please wait a moment</Typography>
                <CircularProgress />
            </Box>
          </Modal>
          <Modal 
            open={openError}
            onClose={handleCloseError}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
          >
            <Box 
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    gap: 2,
                    padding: 5,
                    borderRadius: 2,
                    width: "50%",
                }}
            >
                <Typography variant="h6">{error}</Typography>
                <BuildIcon />
            </Box>
          </Modal>
        </Box>
    )
}

export default FlashcardForm;