import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type {
    BoardSlot as BoardSlotType,
    TimeSlot,
} from "../model/planning.types";

import { BoardSlot } from "./BoardSlot";

interface Props {
    slot: TimeSlot;
    onBoardSelected: (board: BoardSlotType) => void;
}

export function TimeSlotRow({
    slot,
    onBoardSelected,
}: Props) {
    return (
        <Stack spacing={2}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                }}
            >
                {slot.startTime} - {slot.endTime}
            </Typography>

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    flexWrap: "wrap",
                }}
            >
                {slot.boards.map((board) => (
                    <BoardSlot
                        key={board.boardNumber}
                        boardNumber={board.boardNumber}
                        available={board.available}
                        onSelect={() => onBoardSelected(board)}
                    />
                ))}
            </Stack>
        </Stack>
    );
}