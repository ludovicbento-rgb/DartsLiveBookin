import Box from "@mui/material/Box";

export interface LogoProps {
  width?: number | string;
  height?: number | string;
  clickable?: boolean;
}

export function Logo({
  width = 280,
  height = "auto",
  clickable = false,
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
      component="a"
      href="/"
      sx={{
        display: "inline-block",
        textDecoration: "none",
      }}
    >
      {image}
    </Box>
  );
}