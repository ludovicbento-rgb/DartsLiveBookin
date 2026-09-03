import {
    Card,
    CardActionArea,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";

import type {
    BoardSlot as BoardSlotModel,
} from "../model/planning.types";

interface BoardSlotProps {

    board: BoardSlotModel;

    onClick(): void;

}

export function BoardSlot({

    board,

    onClick,

}: BoardSlotProps) {

    const clickable =
        board.status === "AVAILABLE";

    const status =

        board.status === "AVAILABLE"

            ? {

                label: "Disponible",

                icon: "🟢",

                border: "success.main",

                background: "success.50",

            }

            : board.status === "PENDING"

                ? {

                    label: "En attente",

                    icon: "🟠",

                    border: "warning.main",

                    background: "warning.50",

                }

                : {

                    label: "Réservé",

                    icon: "🔴",

                    border: "error.main",

                    background: "error.50",

                };

    return (

        <Card

            variant="outlined"

            sx={{

                minWidth: 180,

                borderColor: status.border,

                bgcolor: status.background,

                transition: "all .20s ease",

                boxShadow: 0,

            }}

        >

            <CardActionArea

                disabled={!clickable}

                onClick={onClick}

                sx={{

                    "&:hover": clickable

                        ? {

                            boxShadow: 3,

                            transform: "scale(1.02)",

                        }

                        : {},

                }}

            >

                <CardContent>

                    <Stack

                        spacing={1}

                        sx={{

                            alignItems: "center",

                        }}

                    >

                        <Typography

                            variant="subtitle1"

                            sx={{

                                fontWeight: 700,

                            }}

                        >

                            🎯 Cible {board.boardNumber}

                        </Typography>

                        <Typography

                            variant="body2"

                            color="text.secondary"

                        >

                            {status.icon} {status.label}

                        </Typography>

                    </Stack>

                </CardContent>

            </CardActionArea>

        </Card>

    );

}

export default BoardSlot;