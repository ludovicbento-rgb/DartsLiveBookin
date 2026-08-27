import type { Timestamp } from "firebase/firestore";

export interface CreateMeetingModel {

    venueId: string;

    registrationId: string;

    opponentRegistrationId: string;

    boardNumber: number;

    startAt: Timestamp;

    endAt: Timestamp;

    notes: string;

}