import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export function App() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            p: 5,
            textAlign: "center",
          }}
        >
          <Typography variant="h4">
            🎯 DartsLive Bookin
          </Typography>

          <Typography
            sx={{ mt: 1, mb: 5 }}
            color="text.secondary"
          >
            Championnat de France Dartslive
          </Typography>

          <Stack spacing={2}>
            <Button variant="contained" size="large">
              Se connecter
            </Button>

            <Button variant="outlined" size="large">
              Créer un compte
            </Button>
          </Stack>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 5,
            }}
          >
            Version 0.1.0
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;