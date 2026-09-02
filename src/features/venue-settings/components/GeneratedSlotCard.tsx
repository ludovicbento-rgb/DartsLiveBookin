import {
    Chip,
} from "@mui/material";

import type {
    ReservationSlot,
} from "@/core/reservation-engine";

interface Props {

    slot: ReservationSlot;

}

export function GeneratedSlotCard({

    slot,

}: Props) {

    return (

        <Chip

            color="primary"

            label={

                `${slot.startTime} → ${slot.endTime}`

            }

        />

    );

}