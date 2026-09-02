import {
    collection,
    doc,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

export const venueSchedulesCollection =
    collection(
        db,
        "venue-schedules",
    );

export function venueScheduleDocument(
    scheduleId: string,
) {

    return doc(

        venueSchedulesCollection,

        scheduleId,

    );

}