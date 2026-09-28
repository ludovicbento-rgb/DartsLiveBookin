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

import type {
    Pool,
} from "@/entities/pool";

interface Props {

    pool: Pool;

    onEdit(
        pool: Pool,
    ): void;

}

export function AdminPoolCard({

    pool,

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

                            <Stack>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >

                                    {pool.name}

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    Ordre : {pool.order}

                                </Typography>

                            </Stack>

                        </Stack>

                        <Chip
                            size="small"
                            color={
                                pool.active
                                    ? "success"
                                    : "default"
                            }
                            label={
                                pool.active
                                    ? "Active"
                                    : "Inactive"
                            }
                        />

                    </Stack>

                    <Button
                        variant="outlined"
                        startIcon={
                            <EditIcon />
                        }
                        onClick={() =>
                            onEdit(
                                pool,
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

export default AdminPoolCard;