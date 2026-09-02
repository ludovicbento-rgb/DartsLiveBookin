import {
    updateVenueSchedule,
} from "@/entities/venue-schedule";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

export async function updateVenueScheduleCommand(

    schedule: VenueSchedule,

) {

    await updateVenueSchedule(
        schedule,
    );

}