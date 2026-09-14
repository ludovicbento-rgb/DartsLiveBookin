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

    const chip =

        slot.status === "AVAILABLE"

            ? {

                color: "success" as const,

                label:
                    `${slot.startTime} → ${slot.endTime}`,

            }

            : slot.status === "RESERVED"

                ? {

                    color: "error" as const,

                    label:
                        `${slot.startTime} → ${slot.endTime}`,

                }

                : {

                    color: "warning" as const,

                    label:

                        slot.blockTitle

                        ??

                        "Indisponible",

                };

    return (

        <Chip

            size="medium"

            color={chip.color}

            label={chip.label}

        />

    );

}

export default GeneratedSlot;