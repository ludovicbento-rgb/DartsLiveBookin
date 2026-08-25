import {
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "@/shared/firebase";

import type {
    CreateReservationRequest,
} from "@/entities/reservation";

export async function createReservation(
    reservation: CreateReservationRequest,
) {
    await addDoc(
        collection(db, "reservations"),
        {
            ...reservation,

            status: "PENDING",

            createdAt: serverTimestamp(),

            updatedAt: serverTimestamp(),

            validatedBy: null,

            notes: "",
        },
    );
}