import type { ReactNode } from "react";
import Container from "@mui/material/Container";

import { Header } from "../../widgets/header";
import { AppBottomNavigation } from "../../widgets/bottom-navigation";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <>
      <Header />

      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 10,
        }}
      >
        {children}
      </Container>

      <AppBottomNavigation />
    </>
  );
}