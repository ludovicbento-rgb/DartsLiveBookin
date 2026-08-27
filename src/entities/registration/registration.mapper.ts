import type {
    QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
    Registration,
} from "./registration.types";

export function mapRegistration(
    snapshot: QueryDocumentSnapshot,
): Registration {

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            Registration,
            "id"
        >),

    };

}