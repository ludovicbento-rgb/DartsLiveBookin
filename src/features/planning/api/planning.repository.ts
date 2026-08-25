import {
    collection,
    onSnapshot,
    getDocs,
    query,
    where,
    Timestamp,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

export async function getPlanningByVenue(
    venueId: string,
    day: Date,
) {
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);

    const end = new Date(day);
    end.setHours(23, 59, 59, 999);

    const q = query(
        collection(db, "reservations"),
        where("venueId", "==", venueId),
        where(
            "startAt",
            ">=",
            Timestamp.fromDate(start),
        ),
        where(
            "startAt",
            "<=",
            Timestamp.fromDate(end),
        ),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}
export function listenPlanningByVenue(
    venueId: string,
    day: Date,
    callback: (reservations: unknown[]) => void,
) {
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);

    const end = new Date(day);
    end.setHours(23, 59, 59, 999);

    const q = query(
        collection(db, "reservations"),
        where("venueId", "==", venueId),
        where(
            "startAt",
            ">=",
            Timestamp.fromDate(start),
        ),
        where(
            "startAt",
            "<=",
            Timestamp.fromDate(end),
        ),
    );

    return onSnapshot(q, (snapshot) => {
        callback(
            snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })),
        );
    });
}