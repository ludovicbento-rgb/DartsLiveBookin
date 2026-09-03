import {
    Stack,
} from "@mui/material";

import {
    PlanningLegend,
} from "./PlanningLegend";

import {
    PlanningSummary,
} from "./PlanningSummary";

import {
    PlanningTable,
} from "./PlanningTable";

import type {
    VenuePlanning,
    BoardSlot,
    TimeSlot,
} from "../model/planning.types";

interface Props {

    planning: VenuePlanning;

    reservationDate: Date;

    onBoardSelected(
        slot: TimeSlot,
        board: BoardSlot,
    ): void;

}

export function PlanningContent({

    planning,

    reservationDate,

    onBoardSelected,

}: Props) {

    return (

        <Stack spacing={3}>

            <PlanningSummary

                planning={planning}

                reservationDate={reservationDate}

            />

            <PlanningLegend />

            <PlanningTable

                planning={planning}

                onBoardSelected={onBoardSelected}

            />

        </Stack>

    );

}