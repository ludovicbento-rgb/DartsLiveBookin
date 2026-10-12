import {
    collection,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

export const auditLogsCollection =
    collection(
        db,
        "auditLogs",
    );