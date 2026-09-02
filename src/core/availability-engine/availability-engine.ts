import {
    buildPlanning,
    type OpeningHours,
    type PlanningBoard,
    type Reservation,
} from "@/core/reservation-engine";

import type {
    AvailabilityClosure,
} from "./model/availability-closure";
import { isDateBetween } from "../common/date";

export interface AvailabilityInput {

    openingHours: OpeningHours;

    durationMinutes: number;

    reservations: Reservation[];

    closures: AvailabilityClosure[];

    reservationDate: Date;

}

export function buildAvailability(

    input: AvailabilityInput,

): PlanningBoard[] {

    function isClosed(
        input: AvailabilityInput,
    ): boolean {

        return input.closures.some(

            closure =>

                closure.active &&

                isDateBetween(

                    input.reservationDate,

                    closure.startDate,

                    closure.endDate,

                ),

        );

    }

    if (isClosed(input)) {

        return [];

    }

    return buildPlanning(

        input.openingHours,

        input.durationMinutes,

        input.reservations,

    );

}