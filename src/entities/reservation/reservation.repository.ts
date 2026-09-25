import {
    collection,
    doc,
    getDocs,
    query,
    runTransaction,
    serverTimestamp,
    where,
    Timestamp,
    onSnapshot,
    getDoc,
} from "firebase/firestore";

import {
    limit,
    orderBy,
} from "firebase/firestore";

import {
    reservationDocument,
} from "./reservation.firestore";

import type {
    UpdateData,
} from "firebase/firestore";

import {
    updateDoc,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

import {
    reservationsCollection,
} from "./reservation.firestore";

import type {
    CreateReservationRequest,
    Reservation,
} from "./reservation.types";

export async function cancelReservation(

    reservationId: string,

    cancelledByUserId: string,

): Promise<void> {

    await updateReservation(

        reservationId,

        {

            status: "CANCELLED",

            cancelledAt:

                serverTimestamp(),

            cancelledByUserId,

        },

    );

}

export async function createReservation(
    request: CreateReservationRequest,
): Promise<string> {

    const reservationRef =
        doc(collection(db, "reservations"));

    await runTransaction(

        db,

        async transaction => {

            //--------------------------------------------------
            // Contrôle disponibilité de la cible
            //--------------------------------------------------

            const boardQuery =
                query(

                    reservationsCollection,

                    where(
                        "plannedStartAt",
                        "==",
                        request.plannedStartAt,
                    ),

                    where(
                        "boardNumber",
                        "==",
                        request.boardNumber,
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

            const boardSnapshot =
                await getDocs(
                    boardQuery,
                );

            if (!boardSnapshot.empty) {

                throw new Error(
                    "BOARD_ALREADY_RESERVED",
                );

            }

            //--------------------------------------------------
            // Création réservation
            //--------------------------------------------------

            transaction.set(

                reservationRef,

                {

                    matchId:
                        request.matchId,

                    venueId:
                        request.venueId,

                    boardNumber:
                        request.boardNumber,

                    plannedStartAt:
                        request.plannedStartAt,

                    plannedEndAt:
                        request.plannedEndAt,

                    status:
                        "PENDING",

                    createdByUserId:
                        request.createdByUserId,

                    createdAt:
                        serverTimestamp(),

                    validatedByUserId:
                        null,

                    validatedAt:
                        null,

                    rejectedByUserId:
                        null,

                    rejectedAt:
                        null,

                    cancelledByUserId:
                        null,

                    cancelledAt:
                        null,

                    validationComment:
                        "",

                    notes:
                        request.notes,

                },

            );

        },

    );

    return reservationRef.id;

}

export async function getReservations(
    reservationIds: string[],
): Promise<Reservation[]> {

    const reservations: Reservation[] = [];

    for (const reservationId of reservationIds) {

        const reservation =
            await getReservation(
                reservationId,
            );

        if (reservation) {

            reservations.push(
                reservation,
            );

        }

    }

    return reservations;

}

export async function getReservation(
    reservationId: string,
): Promise<Reservation | null> {

    const snapshot =
        await getDoc(
            reservationDocument(
                reservationId,
            ),
        );

    if (!snapshot.exists()) {

        return null;

    }

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            Reservation,
            "id"
        >),

    };

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

// TODO Migration Match
// Cette méthode sera remplacée par une recherche basée sur Match.plannedReservationId.
// Conservée temporairement pour assurer la compatibilité du Planning actuel.
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
            "plannedStartAt",
            ">=",
            Timestamp.fromDate(start),
        ),

        where(
            "plannedStartAt",
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

export async function updateReservation(
    reservationId: string,
    values: UpdateData<Reservation>
): Promise<void> {

    await updateDoc(

        reservationDocument(
            reservationId,
        ),

        values,

    );

}

// TODO Migration Match
// Cette méthode sera remplacée par un abonnement sur les Matchs.
// Conservée temporairement pendant la migration.
export function subscribeReservations(
    venueId: string,
    day: Date,
    callback: (
        reservations: Reservation[],
    ) => void,
): () => void {

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
            "plannedStartAt",
            ">=",
            Timestamp.fromDate(start),
        ),

        where(
            "plannedStartAt",
            "<=",
            Timestamp.fromDate(end),
        ),

    );

    return onSnapshot(

        q,

        snapshot => {

            callback(

                snapshot.docs.map(doc => ({

                    id: doc.id,

                    ...(doc.data() as Omit<
                        Reservation,
                        "id"
                    >),

                })),

            );

        },

    );

}

export async function validateReservation(

    reservationId: string,

    validatedByUserId: string,

): Promise<void> {

    await updateReservation(

        reservationId,

        {

            status: "CONFIRMED",

            validatedByUserId,

            validatedAt: serverTimestamp(),

        },

    );

}

export async function rejectReservation(

    reservationId: string,

    rejectedByUserId: string,

    reason: string,

): Promise<void> {

    await updateReservation(

        reservationId,

        {

            status: "REJECTED",

            rejectedByUserId,

            rejectedAt: serverTimestamp(),

            validationComment: reason,

        },

    );

}

export async function getLastReservationByMatch(

    matchId: string,

): Promise<Reservation | null> {

    const q = query(

        reservationsCollection,

        where(

            "matchId",

            "==",

            matchId,

        ),

        orderBy(

            "createdAt",

            "desc",

        ),

        limit(1),

    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty) {

        return null;

    }

    return {

        id: snapshot.docs[0].id,

        ...(snapshot.docs[0].data() as Omit<
            Reservation,
            "id"
        >),

    };

}