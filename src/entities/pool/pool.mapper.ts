import type {
    DocumentSnapshot,
} from "firebase/firestore";

import type {
    Pool,
} from "./pool.types";

export function mapPool(
    document: DocumentSnapshot,
): Pool {

    return {

        id:
            document.id,

        ...(document.data() as Omit<
            Pool,
            "id"
        >),

    };

}