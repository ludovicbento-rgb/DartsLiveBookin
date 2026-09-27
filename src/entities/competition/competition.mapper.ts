import type {
    DocumentSnapshot,
} from "firebase/firestore";

import type {
    Competition,
} from "./competition.types";

export function mapCompetition(
    document: DocumentSnapshot,
): Competition {

    return {

        id:
            document.id,

        ...(document.data() as Omit<
            Competition,
            "id"
        >),

    };

}