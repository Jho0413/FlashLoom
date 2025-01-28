import { Container, Box, Typography, Divider } from "@mui/material";

const PageBodyLayout = ({ children, title }) => {
  return (
    <Container maxWidth="md" sx={{ p: 5, mt: 10, gap: 5, display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight="bold"
          color="white"
        >
          {title}
        </Typography>
        <Divider sx={{ backgroundColor: "white" }}/>
      </Box>
      {children}
    </Container>
  );
}

export default PageBodyLayout; 
