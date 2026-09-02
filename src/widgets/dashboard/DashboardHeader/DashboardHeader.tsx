import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LogoutIcon from "@mui/icons-material/Logout";

interface DashboardHeaderProps {

    firstname: string;

    role: string;

    season: string;

    onLogout: () => void;

}

export function DashboardHeader({

    firstname,

    role,

    season,

    onLogout,

}: DashboardHeaderProps) {

    return (

        <>

            <Stack
                spacing={3}
                sx={{
                    width: "100%",
                    maxWidth: 700,
                    mx: "auto",
                }}
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
                            sx={{
                                fontSize: {
                                    xs: "2.1rem",
                                    sm: "2.8rem",
                                    md: "3.2rem",
                                },
                                fontWeight: 700,
                                lineHeight: 1.1,
                            }}
                        >

                            Bonjour {firstname} 👋

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

                        {season}

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