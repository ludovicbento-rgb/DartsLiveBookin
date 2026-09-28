import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import EditIcon
    from "@mui/icons-material/Edit";

import GroupsIcon
    from "@mui/icons-material/Groups";

import HomeIcon
    from "@mui/icons-material/Home";

import PersonIcon
    from "@mui/icons-material/Person";

import type {
    Registration,
} from "@/entities/registration";

interface Props {

    registration: Registration;

    captainName: string;

    playerNames: string[];

    venueName: string;

    onEdit(
        registration: Registration,
    ): void;

}

export function AdminRegistrationCard({

    registration,

    captainName,

    playerNames,

    venueName,

    onEdit,

}: Props) {

    return (

        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
            }}
        >

            <CardContent>

                <Stack spacing={2}>

                    {/*
                     * --------------------------------------------
                     * Nom + statut
                     * --------------------------------------------
                     */}

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

                            <GroupsIcon
                                color="primary"
                            />

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >

                                {
                                    registration
                                        .registrationName
                                }

                            </Typography>

                        </Stack>

                        <Chip
                            size="small"
                            color={
                                registration.active
                                    ? "success"
                                    : "default"
                            }
                            label={
                                registration.active
                                    ? "Active"
                                    : "Inactive"
                            }
                        />

                    </Stack>

                    {/*
                     * --------------------------------------------
                     * Capitaine
                     * --------------------------------------------
                     */}

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <PersonIcon
                            fontSize="small"
                        />

                        <Typography
                            variant="body2"
                        >

                            <strong>
                                Capitaine :
                            </strong>

                            {" "}

                            {captainName}

                        </Typography>

                    </Stack>

                    {/*
                     * --------------------------------------------
                     * Joueurs
                     * --------------------------------------------
                     */}

                    <Stack spacing={1}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Joueurs

                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >

                            {
                                playerNames.map(
                                    playerName => (

                                        <Chip
                                            key={
                                                playerName
                                            }
                                            size="small"
                                            variant="outlined"
                                            label={
                                                playerName
                                            }
                                        />

                                    ),
                                )
                            }

                        </Stack>

                    </Stack>

                    {/*
                     * --------------------------------------------
                     * Établissement domicile
                     * --------------------------------------------
                     */}

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <HomeIcon
                            fontSize="small"
                        />

                        <Typography
                            variant="body2"
                        >

                            <strong>
                                Domicile :
                            </strong>

                            {" "}

                            {venueName}

                        </Typography>

                    </Stack>

                    <Button
                        variant="outlined"
                        startIcon={
                            <EditIcon />
                        }
                        onClick={() =>
                            onEdit(
                                registration,
                            )
                        }
                    >

                        Modifier

                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default AdminRegistrationCard;