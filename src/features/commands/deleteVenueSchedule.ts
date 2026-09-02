import {
    updateDoc,
} from "firebase/firestore";

import {
    venueScheduleDocument,
} from "@/entities/venue-schedule";

export async function deleteVenueScheduleCommand(

    scheduleId: string,

): Promise<void> {

    await updateDoc(

        venueScheduleDocument(
            scheduleId,
        ),

        {

            active: false,

        },

    );

}