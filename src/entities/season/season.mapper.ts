import type {
    QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
    Season,
} from "./season.types";

export function mapSeason(
    snapshot: QueryDocumentSnapshot,
): Season {

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            Season,
            "id"
        >),

    };

}