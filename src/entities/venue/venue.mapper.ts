import type {
    QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
    Venue,
} from "./venue.types";

export function mapVenue(
    snapshot: QueryDocumentSnapshot,
): Venue {

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            Venue,
            "id"
        >),

    };

}