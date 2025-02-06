import React, { useRef } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const DropFileInput = ({ formData, setFormData, setInputError }) => {

  const fileInputRef = useRef(null);

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
      if (!formData.file)
        setInputError("Please upload a valid PDF file");
    }
  }

  const handleFileRemove = () => {
    // updating formData
    setFormData((prev) => ({ ...prev, file: null }));
    // need to remove from input ref as well
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      <Paper
        sx={{
          padding: 4,
          minHeight: "15rem",
          textAlign: "center",
          border: "2px dashed white",
          borderRadius: 2,
          backgroundColor: "transparent",
          transition: "background-color 0.3s ease",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "&:hover": { backgroundColor: "grey" },
        }}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <CloudUploadIcon sx={{ fontSize: 50, color: "white" }} />
        <Typography variant="h6" mt={2} color="white">
          Click here to upload a file
        </Typography>

        <input
          ref={fileInputRef}
          id="fileInput"
          type="file"
          name="file"
          hidden
          onChange={handleFileUpload}
        />
      </Paper>
      {formData.file && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2">
            {formData.file.name}
          </Typography>
          <IconButton onClick={handleFileRemove}>
            <CloseIcon sx={{ color: "red" }}/>
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

export default DropFileInput;