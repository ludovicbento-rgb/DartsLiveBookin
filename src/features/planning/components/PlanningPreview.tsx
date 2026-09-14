import {
    Card,
    CardContent,
    Chip,
    Collapse,
    IconButton,
    Stack,
    Typography,
    Tooltip,
} from "@mui/material";

import {
    useState,
} from "react";

import ExpandMoreIcon
    from "@mui/icons-material/ExpandMore";

import ExpandLessIcon
    from "@mui/icons-material/ExpandLess";

import type {
    PlanningBoard,
} from "@/core/reservation-engine";

interface Props {

    planning: PlanningBoard[];

    title?: string;

}

export function PlanningPreview({

    planning,

    title = "Créneaux générés",

}: Props) {

    const [

        expanded,

        setExpanded,

    ] = useState(false);

    return (

        <Card
            variant="outlined"
        >

            <CardContent>

                <Stack spacing={2}>

                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >

                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            {title}

                        </Typography>

                        <IconButton
                            onClick={() =>
                                setExpanded(
                                    previous => !previous,
                                )
                            }
                        >

                            {

                                expanded

                                    ? <ExpandLessIcon />

                                    : <ExpandMoreIcon />

                            }

                        </IconButton>

                    </Stack>

                    <Collapse
                        in={expanded}
                    >

                        <Stack
                            spacing={3}
                        >

                            {

                                planning.map(

                                    board => (

                                        <Stack
                                            key={board.boardNumber}
                                            spacing={1}
                                        >

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
                                                            <Tooltip

                                                                title={

                                                                    slot.status === "BLOCKED"

                                                                        ? (

                                                                            slot.blockDescription

                                                                            ??

                                                                            slot.blockTitle

                                                                        )

                                                                        : ""

                                                                }

                                                            >
                                                                <Chip

                                                                    key={`${slot.boardNumber}-${slot.startTime}`}

                                                                    color={

                                                                        slot.status === "AVAILABLE"

                                                                            ? "success"

                                                                            : slot.status === "RESERVED"

                                                                                ? "error"

                                                                                : "warning"

                                                                    }

                                                                    variant={

                                                                        slot.status === "AVAILABLE"

                                                                            ? "outlined"

                                                                            : "filled"

                                                                    }

                                                                    size="small"

                                                                    label={

                                                                        slot.status === "BLOCKED"

                                                                            ? (

                                                                                slot.blockTitle

                                                                                ??

                                                                                "Indisponible"

                                                                            )

                                                                            : `${slot.startTime} → ${slot.endTime}`

                                                                    }

                                                                />

                                                            </Tooltip>

                                                        ),

                                                    )

                                                }

                                            </Stack>

                                        </Stack>

                                    ),

                                )

                            }

                        </Stack>

                    </Collapse>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default PlanningPreview;