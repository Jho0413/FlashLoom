import { Container } from "@mui/material";
import PageBodyLayout from "./pageBodyLayout";

const MainLayout = ({ children, title }) => {
  return (
    <Container maxWidth="100%" sx={{ backgroundImage: "linear-gradient(to top,rgb(58, 58, 58), rgb(30, 30, 30))", height: "100vh", overflowY: 'auto' }}>
      <PageBodyLayout title={title}>
        {children}
      </PageBodyLayout>
    </Container>
  );
}

export default MainLayout;