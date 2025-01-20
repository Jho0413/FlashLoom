"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Container } from "@mui/material";
import Header from "./components/header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <Head>
            <title>FlashLoom</title>
          </Head>
          <body className={inter.className}>
            <Container
              maxWidth="100%"
              disableGutters
              sx={{
                overflowY: "auto",
                backgroundColor: "#121212", 
                color: "white", 
              }}
            >
              <Header />
              {children}
            </Container>
            <Analytics />
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
