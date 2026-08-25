import type { Timestamp } from "firebase/firestore";

export interface ReservationCommand {

    seasonId: string;

    registrationId: string;

    venueId: string;

    playerUid: string;

    boardNumber: number;

    startAt: Timestamp;

    endAt: Timestamp;

}