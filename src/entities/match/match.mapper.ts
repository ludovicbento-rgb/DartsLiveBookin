import type {
    QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
    Match,
} from "./match.types";

export function mapMatch(
    snapshot: QueryDocumentSnapshot,
): Match {

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            Match,
            "id"
        >),

    };

}