import type {
    Timestamp,
} from "firebase/firestore";

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

}