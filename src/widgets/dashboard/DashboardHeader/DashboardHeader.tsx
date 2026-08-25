import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LogoutIcon from "@mui/icons-material/Logout";

interface DashboardHeaderProps {

    firstname: string;

    lastname: string;

    role: string;

    season: string;

    onLogout: () => void;

}

export function DashboardHeader({

    firstname,

    lastname,

    role,

    season,

    onLogout,

}: DashboardHeaderProps) {

    return (

        <>

            <Stack
                spacing={3}
            >

                <Stack
                    direction="row"
                    sx={{

                        justifyContent: "space-between",

                        alignItems: "center",

                    }}
                >

                    <Stack>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            Bonjour {firstname} 👋

                        </Typography>

                        <Typography
                            color="text.secondary"
                        >

                            {lastname}

                        </Typography>

                    </Stack>

                    <Button
                        startIcon={
                            <LogoutIcon />
                        }
                        onClick={onLogout}
                    >

                        Déconnexion

                    </Button>

                </Stack>

                <Divider />

                <Stack
                    direction="row"
                    sx={{
                        justifyContent:
                            "space-between",
                    }}
                >

                    <Typography>

                        Championnat de France Dartslive

                    </Typography>

                    <Typography>

                        Saison {season}

                    </Typography>

                    <Typography
                        color="primary"
                    >

                        {role}

                    </Typography>

                </Stack>

            </Stack>

        </>

    );

}