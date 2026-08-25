import Stack from "@mui/material/Stack";

import type {
    BoardSlot,
    TimeSlot,
    VenuePlanning,
} from "../model/planning.types";

import { TimeSlotRow } from "./TimeSlotRow";

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
        <Stack spacing={4}>
            {planning.slots.map((slot) => (
                <TimeSlotRow
                    key={slot.id}
                    slot={slot}
                    onBoardSelected={(board) =>
                        onBoardSelected(slot, board)
                    }
                />
            ))}
        </Stack>
    );
}