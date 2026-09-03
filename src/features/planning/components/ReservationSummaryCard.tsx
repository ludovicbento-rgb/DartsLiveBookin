import {
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

interface Props {

    homeTeam: string;

    awayTeam: string;

    venueName: string;

    reservationDate: Date;

    start: string;

    end: string;

    boardNumber: number;

}

export function ReservationSummaryCard({

    homeTeam,

    awayTeam,

    venueName,

    reservationDate,

    start,

    end,

    boardNumber,

}: Props) {

    return (

        <Card variant="outlined">

            <CardContent>

                <Stack spacing={2}>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        📋 Récapitulatif

                    </Typography>

                    <Divider />

                    <Stack direction="row"
                        spacing={1.5}
                        sx={{
                            alignItems: "center",
                        }}>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 500,
                            }}
                            color="text.secondary"
                        >

                            🏆

                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 500,
                            }}
                        >

                            {homeTeam}

                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                        >

                            VS

                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 500,
                            }}
                        >

                            {awayTeam}

                        </Typography>

                    </Stack>

                    <Divider />

                    <Stack spacing={0.5}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            📍 Établissement

                        </Typography>

                        <Typography
                            variant="body1"
                        >

                            {venueName}

                        </Typography>

                    </Stack>

                    <Divider />

                    <Stack spacing={0.5}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            🕒 Créneau

                        </Typography>

                        <Typography
                            variant="body1"
                        >

                            {

                                reservationDate.toLocaleDateString(

                                    "fr-FR",

                                    {

                                        weekday: "long",

                                        day: "numeric",

                                        month: "long",

                                        year: "numeric",

                                    },

                                )

                            }

                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                            }}
                        >

                            {start} → {end}

                        </Typography>

                    </Stack>

                    <Divider />

                    <Stack spacing={0.5}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            🎯 Cible

                        </Typography>

                        <Typography
                            variant="body1"
                        >

                            Cible {boardNumber}

                        </Typography>

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default ReservationSummaryCard;