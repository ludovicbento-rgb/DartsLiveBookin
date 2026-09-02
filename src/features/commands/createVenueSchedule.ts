import {
    createVenueSchedule,
} from "@/entities/venue-schedule";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

export async function createVenueScheduleCommand(

    schedule: Omit<
        VenueSchedule,
        "id"
    >,

): Promise<void> {

    await createVenueSchedule(
        schedule,
    );

}