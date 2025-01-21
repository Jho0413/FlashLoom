import { Box, Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const ErrorPage = ({ titleSize, disableButton }) => {

  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{
          textAlign: 'center',
          marginTop: 8,
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Box>
          <Typography 
            variant={titleSize ? titleSize : "h4"} 
            color="error" 
            gutterBottom
          >
            Oops! Something Went Wrong
          </Typography>
          <Typography variant="body1" color="textSecondary">
            We encountered an issue and are working to resolve it. Please try again later.
          </Typography>
        </Box>
        {!disableButton && <Button 
          variant="contained" 
          color="primary" 
          onClick={() => router.push("/")}
          sx={{ marginTop: 2 }}
        >
          Go to Home Page
        </Button>}
      </Container>      
    </Box>
  )
}

export default ErrorPage;