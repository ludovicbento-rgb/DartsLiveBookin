import {
    Stack,
    Typography,
} from "@mui/material";

import type {
    PlanningBoard,
} from "@/core/reservation-engine";

import {
    GeneratedSlot,
} from "./GeneratedSlot";

interface Props {

    board: PlanningBoard;

}

export function GeneratedBoard({

    board,

}: Props) {

    return (

        <Stack spacing={1}>

            <Typography
                variant="body2"
                sx={{
                    fontWeight: 700,
                }}
            >

                🎯 Cible {board.boardNumber}

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

                    board.slots.map(

                        slot => (

                            <GeneratedSlot

                                key={`${slot.boardNumber}-${slot.startTime}`}

                                slot={slot}

                            />

                        ),

                    )

                }

            </Stack>

        </Stack>

    );

}