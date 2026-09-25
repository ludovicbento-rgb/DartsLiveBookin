import {
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import ScheduleIcon
    from "@mui/icons-material/Schedule";

import SportsEsportsIcon
    from "@mui/icons-material/SportsEsports";

import StorefrontIcon
    from "@mui/icons-material/Storefront";

import type {
    AgendaItem,
} from "../model/agenda-item";

interface Props {

    item: AgendaItem;

}

function formatTime(
    date: Date,
): string {

    return date.toLocaleTimeString(
        "fr-FR",
        {
            hour: "2-digit",
            minute: "2-digit",
        },
    );

}

export function AgendaReservationCard({

    item,

}: Props) {

    const start =
        formatTime(
            item.plannedStartAt.toDate(),
        );

    const end =
        formatTime(
            item.plannedEndAt.toDate(),
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

                    {/*
                     * --------------------------------------------
                     * Horaire + cible
                     * --------------------------------------------
                     */}

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={1}
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
                            spacing={1}
                            sx={{
                                alignItems:
                                    "center",
                            }}
                        >

                            <ScheduleIcon
                                color="primary"
                            />

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight:
                                        700,
                                }}
                            >

                                {start} → {end}

                            </Typography>

                        </Stack>

                        <Chip
                            icon={
                                <SportsEsportsIcon />
                            }
                            label={
                                `Cible ${item.boardNumber}`
                            }
                            color="primary"
                            variant="outlined"
                        />

                    </Stack>

                    <Divider />

                    {/*
                     * --------------------------------------------
                     * Match
                     * --------------------------------------------
                     */}

                    <Stack
                        spacing={0.5}
                        sx={{
                            alignItems:
                                "center",
                        }}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            Journée {item.matchDayNumber}

                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight:
                                    700,

                                textAlign:
                                    "center",
                            }}
                        >

                            {item.homeTeam}

                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontWeight:
                                    700,
                            }}
                        >

                            VS

                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight:
                                    700,

                                textAlign:
                                    "center",
                            }}
                        >

                            {item.awayTeam}

                        </Typography>

                    </Stack>

                    <Divider />

                    {/*
                     * --------------------------------------------
                     * Établissement
                     * --------------------------------------------
                     */}

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems:
                                "center",
                        }}
                    >

                        <StorefrontIcon
                            fontSize="small"
                        />

                        <Typography>

                            {item.venueName}

                        </Typography>

                    </Stack>

                    {/*
                     * --------------------------------------------
                     * Commentaire
                     * --------------------------------------------
                     */}

                    {
                        item.notes.trim() !== "" && (

                            <>

                                <Divider />

                                <Stack spacing={0.5}>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >

                                        Commentaire du joueur

                                    </Typography>

                                    <Typography>

                                        {item.notes}

                                    </Typography>

                                </Stack>

                            </>

                        )
                    }

                </Stack>

            </CardContent>

        </Card>

    );

}

export default AgendaReservationCard;