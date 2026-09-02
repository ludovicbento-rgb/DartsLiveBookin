import {
    Alert,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

interface Props {

    reservationDate: Date;

    availableBoards: number;

    reservedBoards: number;

}

export function PlanningSummary({

    reservationDate,

    availableBoards,

    reservedBoards,

}: Props) {

    return (

        <Alert severity="info">

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >

                <Typography
                    sx={{
                        fontWeight: 600,
                    }}
                >

                    📅 {

                        reservationDate
                            .toLocaleDateString(
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

                <Chip
                    color="success"
                    label={`${availableBoards} créneaux libres`}
                />

                <Chip
                    color="warning"
                    label={`${reservedBoards} réservés`}
                />

            </Stack>

        </Alert>

    );

}

export default PlanningSummary;