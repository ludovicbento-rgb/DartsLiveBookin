export type MatchStatus =
    | "NOT_PLANNED"
    | "PENDING"
    | "PLANNED";

export interface Match {

    id: string;

    matchDayId: string;

    homeRegistrationId: string;

    awayRegistrationId: string;

    status: MatchStatus;

    plannedReservationId: string | null;

}