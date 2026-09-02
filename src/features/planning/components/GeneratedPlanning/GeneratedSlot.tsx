import Chip from "@mui/material/Chip";

import type {
    ReservationSlot,
} from "@/core/reservation-engine";

interface Props {

    slot: ReservationSlot;

}

export function GeneratedSlot({

    slot,

}: Props) {

    return (

        <Chip

            size="small"

            color={

                slot.reserved

                    ? "error"

                    : "success"

            }

            label={`${slot.startTime} → ${slot.endTime}`}

        />

    );

}