import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { BoardSlot } from "./BoardSlot";

import type {
    BoardSlot as BoardSlotModel,
    TimeSlot,
} from "../model/planning.types";

interface TimeSlotRowProps {

    slot: TimeSlot;

    onBoardSelected(
        slot: TimeSlot,
        board: BoardSlotModel,
    ): void;

}

export function TimeSlotRow({

    slot,

    onBoardSelected,

}: TimeSlotRowProps) {

    return (

        <Card
            variant="outlined"
        >

            <CardContent>

                <Stack spacing={3}>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        🕒 {slot.startTime} → {slot.endTime}

                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{

                            flexWrap: "wrap",

                            gap: 2,

                        }}
                    >

                        {

                            slot.boards.map(

                                board => (

                                    <BoardSlot

                                        key={board.boardNumber}

                                        board={board}

                                        onClick={() =>

                                            onBoardSelected(

                                                slot,

                                                board,

                                            )

                                        }

                                    />

                                ),

                            )

                        }

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default TimeSlotRow;