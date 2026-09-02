import {
    useMemo,
} from "react";

import {
    buildReservationSlots,
} from "@/core/reservation-engine";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

export function useGeneratedSlots(

    schedules: VenueSchedule[],

    durationMinutes: number,

) {

    return useMemo(() =>

        schedules.flatMap(

            schedule =>

                buildReservationSlots(

                    {

                        openTime: schedule.startTime,
                        closeTime: schedule.endTime,

                        boardNumbers:
                            schedule.boardNumbers,

                    },

                    durationMinutes,

                ),

        ),

        [

            schedules,

            durationMinutes,

        ]);

}