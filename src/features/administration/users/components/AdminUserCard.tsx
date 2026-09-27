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

import PersonIcon
    from "@mui/icons-material/Person";

import type {
    AdminUserListItem,
} from "../model/admin-user.types";

interface Props {

    user: AdminUserListItem;

    onEdit(
        user: AdminUserListItem,
    ): void;

}

export function AdminUserCard({

    user,

    onEdit,

}: Props) {

    const roleLabels: string[] = [];

    if (user.roles.player) {
        roleLabels.push("Joueur");
    }

    if (user.roles.manager) {
        roleLabels.push("Gérant");
    }

    if (user.roles.administrator) {
        roleLabels.push("Administrateur");
    }

    return (

        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
            }}
        >

            <CardContent>

                <Stack spacing={2}>

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

                            <PersonIcon
                                color="primary"
                            />

                            <Stack>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight:
                                            700,
                                    }}
                                >

                                    {user.firstname}
                                    {" "}
                                    {user.lastname}

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    Licence {user.licenseNumber}

                                </Typography>

                            </Stack>

                        </Stack>

                        <Chip
                            size="small"
                            color={
                                user.status === "ACTIVE"
                                    ? "success"
                                    : "error"
                            }
                            label={
                                user.status === "ACTIVE"
                                    ? "Actif"
                                    : "Bloqué"
                            }
                        />

                    </Stack>

                    {
                        user.email.trim() !== "" && (

                            <Typography
                                variant="body2"
                            >

                                {user.email}

                            </Typography>

                        )
                    }

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >

                        <Chip
                            size="small"
                            variant="outlined"
                            color={
                                user.accountActivated
                                    ? "success"
                                    : "default"
                            }
                            label={
                                user.accountActivated
                                    ? "Compte activé"
                                    : "Compte non activé"
                            }
                        />

                        {
                            roleLabels.map(
                                role => (

                                    <Chip
                                        key={role}
                                        size="small"
                                        label={role}
                                        color={
                                            role === "Administrateur"
                                                ? "primary"
                                                : role === "Gérant"
                                                    ? "warning"
                                                    : "default"
                                        }
                                    />

                                ),
                            )
                        }

                    </Stack>

                    <Button
                        variant="outlined"
                        startIcon={
                            <EditIcon />
                        }
                        onClick={() =>
                            onEdit(user)
                        }
                    >

                        Modifier

                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default AdminUserCard;