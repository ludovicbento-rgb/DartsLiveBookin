import {
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import EditIcon
    from "@mui/icons-material/Edit";

import DeleteIcon
    from "@mui/icons-material/Delete";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

interface Props {

    schedule: VenueSchedule;

    onEdit(
        schedule: VenueSchedule,
    ): void;

    onDelete(
        schedule: VenueSchedule,
    ): void;

}

export function VenueScheduleRow({

    schedule,

    onEdit,

    onDelete,

}: Props) {

    return (

        <Stack

            direction="row"

            sx={{

                justifyContent:
                    "space-between",

                alignItems:
                    "center",

            }}

        >

            <Stack>

                <Typography>

                    {

                        schedule.startTime

                    }

                    {" → "}

                    {

                        schedule.endTime

                    }

                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "text.secondary",
                    }}
                >

                    🎯

                    {

                        schedule.boardNumbers.length > 1

                            ? "Cibles "

                            : "Cible "

                    }

                    {

                        schedule.boardNumbers.join(" • ")

                    }

                </Typography>

            </Stack>

            <Stack
                direction="row"
            >

                <IconButton
                    onClick={() =>
                        onEdit(schedule)
                    }
                >

                    <EditIcon />

                </IconButton>

                <IconButton
                    onClick={() =>
                        onDelete(schedule)
                    }
                >

                    <DeleteIcon />

                </IconButton>

            </Stack>

        </Stack>

    );

}