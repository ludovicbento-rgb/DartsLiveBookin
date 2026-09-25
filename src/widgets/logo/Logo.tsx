import Box from "@mui/material/Box";

import {
  Link,
} from "react-router-dom";

export interface LogoProps {

  width?: number | string;

  height?: number | string;

  clickable?: boolean;

  to?: string;

}

export function Logo({

  width = 280,

  height = "auto",

  clickable = false,

  to = "/",

}: LogoProps) {

  const image = (

    <Box
      component="img"
      src="/branding/logos/dartslive-bookin.png"
      alt="DartsLive Bookin"
      sx={{
        width,
        height,
        display: "block",
        userSelect: "none",
      }}
    />

  );

  if (!clickable) {

    return image;

  }

  return (

    <Box
      component={Link}
      to={to}
      sx={{
        display: "inline-block",
        textDecoration: "none",
      }}
    >

      {image}

    </Box>

  );

}