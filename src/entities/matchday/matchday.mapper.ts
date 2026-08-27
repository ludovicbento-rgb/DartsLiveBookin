import type {
    QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
    MatchDay,
} from "./matchday.types";

export function mapMatchDay(
    snapshot: QueryDocumentSnapshot,
): MatchDay {

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            MatchDay,
            "id"
        >),

    };

}