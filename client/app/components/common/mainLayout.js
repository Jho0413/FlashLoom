import { Container, Box, Typography, Divider } from "@mui/material";

const MainLayout = ({ children, title }) => {
  return (
    <Container maxWidth="100%" sx={{ backgroundImage: "linear-gradient(to top,rgb(58, 58, 58), rgb(30, 30, 30))", height: "100vh", overflowY: 'auto' }}>
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
    </Container>
  );
}

export default MainLayout;