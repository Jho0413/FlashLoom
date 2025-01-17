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
import InputField from "../components/inputField"
import { useEffect, useState } from "react"
import BuildIcon from '@mui/icons-material/Build';
import { useUser } from "@clerk/nextjs"

const FlashcardForm = ({ setFlashcards, setFlippedStates }) => {
    const { user } = useUser();
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
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

    const handleFileUpload = (e) => {
      e.preventDefault();
      const file = e.target.files?.[0];
      if (file && file.type && file.type === 'application/pdf') {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [e.target.name]: file,
        }));
      } else {
        setError("Upload a valid pdf file");
        setOpenError(true);
        e.target.value = '';
      }
    }

    const handleSubmit = async () => {
        setLoading(true);
        console.log({...formData});
        console.log(file);
        try {
            const uploadData = new FormData();

            // Append the form data to the FormData object
            for (const key in formData) {
              uploadData.append(key, formData[key]);
            }
            
            // Add any other fields you want to include in the form data
            uploadData.append('method', tabName);
            const response = await fetch("/api/generate", {
              method: "POST",
              body: { ...uploadData },
            });
       
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error_message);
            }
            console.log("Generated flashcards:", data); 
            console.log(data.flashcards);
       
            if (data.flashcards) {
              setFlippedStates({});
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
                }}
            >
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
                    padding: 3,
                    borderRadius: 2,
                    maxWidth: "50%",
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