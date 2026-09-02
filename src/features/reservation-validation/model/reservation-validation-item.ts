import type {
    Timestamp,
} from "firebase/firestore";

export interface ReservationValidationItem {

    matchId: string;

    reservationId: string;

    matchDayNumber: number;

    homeTeam: string;

    awayTeam: string;

    venueId: string;

    venueName: string;

    boardNumber: number;

    plannedStartAt: Timestamp;

    plannedEndAt: Timestamp;

    notes: string;

    /**
     * Le gérant reçoit-il cette rencontre ?
     */
    isHomeMatch: boolean;

    /**
     * Nombre de jours avant la réservation.
     */
    daysBeforeReservation: number;

}       