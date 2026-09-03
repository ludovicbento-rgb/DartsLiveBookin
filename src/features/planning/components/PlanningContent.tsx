import {
    Stack,
} from "@mui/material";

import {
    PlanningSummary,
} from "./PlanningSummary";

import {
    PlanningHeader,
} from "./PlanningHeader";

import {
    PlanningTable,
} from "./PlanningTable";

import type {
    BoardSlot,
    TimeSlot,
    VenuePlanning,
} from "../model/planning.types";

import type {
    VenueStatus,
} from "@/entities/venue/venue-status";

interface Props {

    planning: VenuePlanning;

    reservationDate: Date;

    homeTeam: string;

    awayTeam: string;

    venueLogo: string;

    onReservationDateChanged(
        value: Date,
    ): void;

    onBoardSelected(
        slot: TimeSlot,
        board: BoardSlot,
    ): void;

    venueStatus: VenueStatus;
}

export function PlanningContent({

    planning,

    reservationDate,

    homeTeam,

    awayTeam,

    venueLogo,

    onReservationDateChanged,

    onBoardSelected,

    venueStatus,

}: Props) {

    return (

        <Stack spacing={3}>

            <PlanningSummary

                reservationDate={reservationDate}

                onReservationDateChanged={
                    onReservationDateChanged
                }

                homeTeam={homeTeam}

                awayTeam={awayTeam}

            />

            <PlanningHeader

                planning={planning}

                logo={venueLogo}

                venueStatus={venueStatus}

            />

            <PlanningTable

                planning={planning}

                onBoardSelected={onBoardSelected}

            />

        </Stack>

    );

}

export default PlanningContent;