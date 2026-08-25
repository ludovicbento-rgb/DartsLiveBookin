import type { Timestamp } from "firebase/firestore";

export type ReservationStatus =
    | "PENDING"
    | "CONFIRMED"
    | "REFUSED"
    | "CANCELLED";

export interface Reservation {
    id: string;

    seasonId: string;

    venueId: string;

    registrationId: string;

    playerUid: string;

    boardNumber: number;

    startAt: Timestamp;

    endAt: Timestamp;

    status: ReservationStatus;

    createdAt: Timestamp;

    updatedAt: Timestamp;

    validatedBy: string | null;

    notes: string;
}

export interface CreateReservationRequest {
    seasonId: string;

    venueId: string;

    registrationId: string;

    playerUid: string;

    boardNumber: number;

    startAt: Timestamp;

    endAt: Timestamp;
}   