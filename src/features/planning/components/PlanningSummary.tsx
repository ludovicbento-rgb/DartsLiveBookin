import {
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

import type {
    VenuePlanning,
} from "../model/planning.types";

interface Props {

    planning: VenuePlanning;

    reservationDate: Date;

}

export function PlanningSummary({

    planning,

    reservationDate,

}: Props) {

    const totalBoards =

        planning.slots.reduce(

            (count, slot) =>

                count + slot.boards.length,

            0,

        );

    const availableBoards =

        planning.slots.reduce(

            (count, slot) =>

                count +

                slot.boards.filter(

                    board =>

                        board.status === "AVAILABLE",

                ).length,

            0,

        );

    const pendingBoards =

        planning.slots.reduce(

            (count, slot) =>

                count +

                slot.boards.filter(

                    board =>

                        board.status === "PENDING",

                ).length,

            0,

        );

    const confirmedBoards =

        planning.slots.reduce(

            (count, slot) =>

                count +

                slot.boards.filter(

                    board =>

                        board.status === "CONFIRMED",

                ).length,

            0,

        );

    return (

        <Card variant="outlined">

            <CardContent>

                <Stack spacing={2}>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <SportsEsportsIcon
                            color="primary"
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            {planning.venueName}

                        </Typography>

                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <EventIcon
                            fontSize="small"
                            color="action"
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

                    <Divider />

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >

                        <Chip
                            color="success"
                            label={`${availableBoards} disponibles`}
                        />

                        <Chip
                            color="warning"
                            label={`${pendingBoards} en attente`}
                        />

                        <Chip
                            color="error"
                            label={`${confirmedBoards} réservés`}
                        />

                        <Chip
                            variant="outlined"
                            label={`${totalBoards} créneaux`}
                        />

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default PlanningSummary;