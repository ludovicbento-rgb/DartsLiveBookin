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

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

import type {
    MatchDay,
} from "@/entities/matchday";

interface Props {

    matchDay: MatchDay;

    onEdit(
        matchDay: MatchDay,
    ): void;

}

export function AdminMatchDayCard({

    matchDay,

    onEdit,

}: Props) {

    const officialDate =
        matchDay.officialDate
            .toDate()
            .toLocaleDateString(
                "fr-FR",
                {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                },
            );

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
                                alignItems: "center",
                            }}
                        >

                            <CalendarMonthIcon
                                color="primary"
                            />

                            <Stack>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >

                                    {matchDay.displayName}

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    Journée {matchDay.number}

                                    {" — "}

                                    {officialDate}

                                </Typography>

                            </Stack>

                        </Stack>

                        <Chip
                            size="small"
                            color={
                                matchDay.active
                                    ? "success"
                                    : "default"
                            }
                            label={
                                matchDay.active
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
                                matchDay,
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

export default AdminMatchDayCard;