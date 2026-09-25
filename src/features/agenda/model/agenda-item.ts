import type {
    Timestamp,
} from "firebase/firestore";

export interface AgendaItem {

    reservationId: string;

    matchId: string;

    venueId: string;

    venueName: string;

    matchDayNumber: number;

    homeTeam: string;

    awayTeam: string;

    boardNumber: number;

    plannedStartAt: Timestamp;

    plannedEndAt: Timestamp;

    notes: string;

}