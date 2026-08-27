export interface PlanningSlot {

    boardNumber: number;

    reservationId: string | null;

    matchId: string | null;

    startTime: string;

    endTime: string;

    status:
    | "AVAILABLE"
    | "PENDING"
    | "CONFIRMED";

    label: string;

}