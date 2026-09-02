import {
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
} from "firebase/firestore";

import {
    venueSchedulesCollection,
} from "./venue-schedule.firestore";

import {
    mapVenueSchedule,
} from "./venue-schedule.mapper";

import type {
    VenueSchedule,
} from "./venue-schedule.types";

import {
    venueScheduleDocument,
} from "./venue-schedule.firestore";

export async function getVenueSchedules(

    venueId: string,

): Promise<VenueSchedule[]> {

    const q = query(

        venueSchedulesCollection,

        where(
            "venueId",
            "==",
            venueId,
        ),

        where(
            "active",
            "==",
            true,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs
        .map(mapVenueSchedule)
        .sort((a, b) => {

            if (
                a.dayOfWeek !==
                b.dayOfWeek
            ) {

                return (
                    a.dayOfWeek -
                    b.dayOfWeek
                );

            }

            return a.startTime.localeCompare(
                b.startTime,
            );

        });

}

export async function createVenueSchedule(
    schedule: Omit<
        VenueSchedule,
        "id"
    >,
): Promise<void> {

    const q = query(

        venueSchedulesCollection,

        where(
            "venueId",
            "==",
            schedule.venueId,
        ),

        where(
            "dayOfWeek",
            "==",
            schedule.dayOfWeek,
        ),

        where(
            "active",
            "==",
            true,
        ),

    );

    const snapshot =
        await getDocs(q);

    const overlap =
        snapshot.docs.some(doc => {

            const existing =
                mapVenueSchedule(doc);

            return !(
                schedule.endTime <= existing.startTime ||
                schedule.startTime >= existing.endTime
            );

        });

    if (overlap) {

        throw new Error(
            "SCHEDULE_OVERLAP",
        );

    }

    await addDoc(

        venueSchedulesCollection,

        schedule,

    );

}

export async function updateVenueSchedule(

    schedule: VenueSchedule,

): Promise<void> {

    await updateDoc(

        venueScheduleDocument(
            schedule.id,
        ),

        {

            startTime:
                schedule.startTime,

            endTime:
                schedule.endTime,

            boardNumbers:
                schedule.boardNumbers,

            active:
                schedule.active,

        },

    );

}