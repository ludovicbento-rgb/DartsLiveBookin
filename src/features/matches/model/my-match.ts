import type {
    Timestamp,
} from "firebase/firestore";

export interface MyMatch {

    matchId: string;

    reservationId: string | null;

    matchDay: string;

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

}