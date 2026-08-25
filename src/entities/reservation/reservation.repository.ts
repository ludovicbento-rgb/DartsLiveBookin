import {
    collection,
    doc,
    getDocs,
    query,
    runTransaction,
    serverTimestamp,
    where,
    Timestamp,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

import {
    reservationsCollection,
} from "./reservation.firestore";

import type {
    CreateReservationRequest,
    Reservation,
} from "./reservation.types";

export async function createReservation(
    request: CreateReservationRequest,
): Promise<void> {

    const reservationRef =
        doc(collection(db, "reservations"));

    await runTransaction(
        db,
        async (transaction) => {

            const q = query(
                reservationsCollection,

                where(
                    "venueId",
                    "==",
                    request.venueId,
                ),

                where(
                    "boardNumber",
                    "==",
                    request.boardNumber,
                ),

                where(
                    "startAt",
                    "==",
                    request.startAt,
                ),

                where(
                    "status",
                    "in",
                    [
                        "PENDING",
                        "CONFIRMED",
                    ],
                ),
            );

            const snapshot =
                await getDocs(q);

            if (!snapshot.empty) {
                throw new Error(
                    "BOARD_ALREADY_RESERVED",
                );
            }

            transaction.set(
                reservationRef,
                {
                    ...request,

                    status: "PENDING",

                    validatedBy: null,

                    notes: "",

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),
                },
            );

        },
    );

}

export async function getReservationsByPlayer(
    playerUid: string,
): Promise<Reservation[]> {

    const q = query(
        reservationsCollection,
        where(
            "playerUid",
            "==",
            playerUid,
        ),
    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(doc => {

        const data =
            doc.data() as Omit<
                Reservation,
                "id"
            >;

        return {

            id: doc.id,

            ...data,

        };

    });

}

export async function getReservationsByVenueAndDay(
    venueId: string,
    day: Date,
): Promise<Reservation[]> {

    const start = new Date(day);
    start.setHours(0, 0, 0, 0);

    const end = new Date(day);
    end.setHours(23, 59, 59, 999);

    const q = query(
        reservationsCollection,

        where(
            "venueId",
            "==",
            venueId,
        ),

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

    return snapshot.docs.map((doc) => {

        const data =
            doc.data() as Omit<
                Reservation,
                "id"
            >;

        return {

            id: doc.id,

            ...data,

        };

    });

}