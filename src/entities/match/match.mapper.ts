import type {
    QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
    Match,
    MatchPlayStatus,
} from "./match.types";

function normalizePlayStatus(
    value: unknown,
): MatchPlayStatus {

    if (
        value === "PLAYED"
    ) {

        return "PLAYED";

    }

    /*
     * Compatibilité historique :
     * absence ou valeur inconnue = TO_PLAY.
     */
    return "TO_PLAY";

}

export function mapMatch(
    snapshot: QueryDocumentSnapshot,
): Match {

    const data =
        snapshot.data();

    return {

        id:
            snapshot.id,

        ...(data as Omit<
            Match,
            "id"
            |
            "playStatus"
        >),

        playStatus:
            normalizePlayStatus(
                data.playStatus,
            ),

    };

}