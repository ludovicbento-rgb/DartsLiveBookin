import {
    Card,
    CardContent,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventIcon from "@mui/icons-material/Event";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

import { useNavigate } from "react-router-dom";

import PlanningDateSelector from "./PlanningDateSelector";

interface Props {

    homeTeam: string;

    awayTeam: string;

    reservationDate: Date;

    onReservationDateChanged(
        value: Date,
    ): void;

}

export function PlanningSummary({

    homeTeam,

    awayTeam,

    reservationDate,

    onReservationDateChanged,

}: Props) {

    const navigate = useNavigate();

    return (

        <Card variant="outlined">

            <CardContent>

                <Stack spacing={3}>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <IconButton
                            onClick={() => navigate(-1)}
                        >

                            <ArrowBackIcon />

                        </IconButton>

                        <Typography
                            variant="overline"
                            color="text.secondary"
                        >

                            MATCH À PLANIFIER

                        </Typography>

                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >

                        <SportsEsportsIcon
                            color="error"
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 500,
                            }}
                        >

                            {homeTeam}

                        </Typography>

                        <Typography
                            variant="body1"
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

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >

                        <EventIcon
                            fontSize="small"
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
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

                    </Stack>

                    <PlanningDateSelector

                        value={reservationDate}

                        onChange={
                            onReservationDateChanged
                        }

                    />

                </Stack>

            </CardContent>

        </Card>

    );

}

export default PlanningSummary; 