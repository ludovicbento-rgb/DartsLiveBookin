import type { Timestamp } from "firebase/firestore";

export type ReservationStatus =
    | "PENDING"
    | "CONFIRMED"
    | "REJECTED"
    | "CANCELLED";

export interface Reservation {

    id: string;

    matchId: string;

    boardNumber: number;

    plannedStartAt: Timestamp;

    plannedEndAt: Timestamp;

    status: ReservationStatus;

    createdByUserId: string;

    createdAt: Timestamp;

    validatedByUserId: string | null;

    validatedAt: Timestamp | null;

    rejectedByUserId: string | null;

    rejectedAt: Timestamp | null;

    cancelledByUserId: string | null;

    cancelledAt: Timestamp | null;

    validationComment: string;

    notes: string;

}

export interface CreateReservationRequest {

    matchId: string;

    venueId: string;

    boardNumber: number;

    plannedStartAt: Timestamp;

    plannedEndAt: Timestamp;

    createdByUserId: string;

    notes: string;

}