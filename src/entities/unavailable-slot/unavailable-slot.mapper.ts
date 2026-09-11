import type {

    QueryDocumentSnapshot,

} from "firebase/firestore";

import type {

    UnavailableSlot,

} from "./unavailable-slot.types";

export function mapUnavailableSlot(

    snapshot: QueryDocumentSnapshot,

): UnavailableSlot {

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            UnavailableSlot,
            "id"
        >),

    };

}