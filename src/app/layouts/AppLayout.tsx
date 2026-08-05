import type { ReactNode } from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { Header } from "../../widgets/header";
import { Footer } from "../../widgets/footer";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <>
      <Header />

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,#fafafa,#eef2f5)",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            pt: 6,
            pb: 8,
          }}
        >
          {children}

          <Footer />
        </Container>
      </Box>
    </>
  );
}