import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";

export function AppBottomNavigation() {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <BottomNavigation showLabels>
        <BottomNavigationAction
          label="Accueil"
          icon={<HomeIcon />}
        />

        <BottomNavigationAction
          label="Réserver"
          icon={<EventIcon />}
        />

        <BottomNavigationAction
          label="Réservations"
          icon={<ListAltIcon />}
        />

        <BottomNavigationAction
          label="Profil"
          icon={<PersonIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}