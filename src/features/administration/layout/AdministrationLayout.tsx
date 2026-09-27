import {
    Button,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import AdminPanelSettingsIcon
    from "@mui/icons-material/AdminPanelSettings";

import {
    useNavigate,
} from "react-router-dom";

import type {
    ReactNode,
} from "react";

import {
    AppLayout,
} from "@/app/layouts/AppLayout";

interface Props {

    children: ReactNode;

}

export function AdministrationLayout({

    children,

}: Props) {

    const navigate =
        useNavigate();

    return (

        <AppLayout>

            <Stack
                spacing={3}
                sx={{
                    width:
                        "100%",

                    maxWidth:
                        900,

                    mx:
                        "auto",
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                    sx={{
                        justifyContent:
                            "space-between",

                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            alignItems:
                                "center",
                        }}
                    >

                        <AdminPanelSettingsIcon
                            color="primary"
                            fontSize="large"
                        />

                        <Stack>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight:
                                        700,
                                }}
                            >

                                Administration

                            </Typography>

                            <Typography
                                color="text.secondary"
                            >

                                DartsLive Bookin

                            </Typography>

                        </Stack>

                    </Stack>

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBackIcon />
                        }
                        onClick={() =>
                            navigate(
                                "/dashboard",
                            )
                        }
                    >

                        Tableau de bord

                    </Button>

                </Stack>

                {children}

            </Stack>

        </AppLayout>

    );

}

export default AdministrationLayout;