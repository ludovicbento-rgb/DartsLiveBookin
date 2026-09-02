import type {
    OpeningHours,
} from "@/core/reservation-engine";

import type {
    VenueSchedule,
} from "./venue-schedule.types";

export function mapOpeningHours(

    schedule: VenueSchedule,

): OpeningHours {

    return {

        openTime:
            schedule.startTime,

        closeTime:
            schedule.endTime,

        boardNumbers:
            schedule.boardNumbers,

    };

}   