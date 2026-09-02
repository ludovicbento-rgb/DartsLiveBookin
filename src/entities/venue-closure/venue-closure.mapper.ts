import type {
    QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
    VenueClosure,
} from "./venue-closure.types";

export function mapVenueClosure(

    snapshot: QueryDocumentSnapshot,

): VenueClosure {

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            VenueClosure,
            "id"
        >),

    };

}