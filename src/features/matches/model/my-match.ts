import type {
    Timestamp,
} from "firebase/firestore";

import type {
    ReservationStatus,
} from "@/entities/reservation";

export interface MyMatch {

    matchId: string;

    venueId: string;

    venueLogo: string | null;

    reservationId: string | null;

    matchDayNumber: number;

    matchDayLabel: string;

    homeTeam: string;

    awayTeam: string;

    venueName: string;

    boardNumber: number | null;

    plannedStartAt: Timestamp | null;

    plannedEndAt: Timestamp | null;

    status:
    | "NOT_PLANNED"
    | "PENDING"
    | "PLANNED";

    notes: string;

    lastReservation: LastReservationInfo | null;

}

export interface LastReservationInfo {

    id: string | null;

    status: ReservationStatus | null;

    validationComment: string | null;

}