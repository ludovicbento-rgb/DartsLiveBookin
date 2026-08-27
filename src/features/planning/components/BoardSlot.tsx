import Chip from "@mui/material/Chip";

import type {
    BoardSlot as BoardSlotModel,
} from "../model/planning.types";

interface BoardSlotProps {

    board: BoardSlotModel;

    onClick: () => void;

}

export function BoardSlot({

    board,

    onClick,

}: BoardSlotProps) {

    const color =
        board.status === "AVAILABLE"
            ? "success"
            : board.status === "PENDING"
                ? "warning"
                : "error";

    const clickable =
        board.status === "AVAILABLE";

    const label =
        `Cible ${board.boardNumber}`;

    return (

        <Chip

            label={label}

            color={color}

            variant={
                clickable
                    ? "filled"
                    : "outlined"
            }

            clickable={clickable}

            onClick={
                clickable
                    ? onClick
                    : undefined
            }

            sx={{

                width: "100%",

                fontWeight: 600,

            }}

        />

    );

}