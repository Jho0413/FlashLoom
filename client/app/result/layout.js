"use client";

import { Container } from "@mui/material";

export default function ResultPageLayout({ children }) {
  return (
    <Container maxWidth="100%" sx={{ backgroundImage: "linear-gradient(to top,rgb(58, 58, 58), rgb(30, 30, 30))", height: "100vh", overflowY: 'auto' }}>
      {children}
    </Container>
  );
}