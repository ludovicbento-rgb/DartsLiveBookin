import {
    Button,
    Card,
    CardContent,
    Collapse,
    Stack,
} from "@mui/material";

import {
    useState,
} from "react";

import ExpandLessIcon
    from "@mui/icons-material/ExpandLess";

import ExpandMoreIcon
    from "@mui/icons-material/ExpandMore";

import type {
    PlanningBoard,
} from "@/core/reservation-engine";

import {
    GeneratedBoard,
} from "./GeneratedBoard";

interface Props {

    planning: PlanningBoard[];

}

export function GeneratedPlanningCard({

    planning,

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

                    <Button

                        variant="text"

                        endIcon={

                            expanded

                                ? <ExpandLessIcon />

                                : <ExpandMoreIcon />

                        }

                        onClick={() =>

                            setExpanded(

                                previous => !previous,

                            )

                        }

                    >

                        Créneaux générés

                    </Button>

                    <Collapse
                        in={expanded}
                    >

                        <Stack spacing={3}>

                            {

                                planning.map(

                                    board => (

                                        <GeneratedBoard

                                            key={board.boardNumber}

                                            board={board}

                                        />

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