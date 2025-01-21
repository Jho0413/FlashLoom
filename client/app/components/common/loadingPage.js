import { Box, CircularProgress } from "@mui/material";

const LoadingPage = ({ colour, size }) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={size} color={colour}/>
    </Box>
  )
}

export default LoadingPage;