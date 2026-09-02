import type {
    QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
    VenueSchedule,
} from "./venue-schedule.types";

export function mapVenueSchedule(

    snapshot: QueryDocumentSnapshot,

): VenueSchedule {

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            VenueSchedule,
            "id"
        >),

    };

}