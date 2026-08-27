import Stack from "@mui/material/Stack";

import { TimeSlotRow } from "./TimeSlotRow";

import type {
    BoardSlot,
    TimeSlot,
    VenuePlanning,
} from "../model/planning.types";

interface PlanningTableProps {

    planning: VenuePlanning;

    onBoardSelected: (
        slot: TimeSlot,
        board: BoardSlot,
    ) => void;

}

export function PlanningTable({

    planning,

    onBoardSelected,

}: PlanningTableProps) {

    return (

        <Stack
            spacing={1}
        >

            {planning.slots.map(slot => (

                <TimeSlotRow

                    key={slot.startTime}

                    slot={slot}

                    onBoardSelected={
                        onBoardSelected
                    }

                />

            ))}

        </Stack>

    );

}

export default PlanningTable;