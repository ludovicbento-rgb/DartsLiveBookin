export interface PlanningItem {

    reservationId: string;

    matchId: string;

    boardNumber: number;

    startTime: string;

    endTime: string;

    status:
    | "AVAILABLE"
    | "PENDING"
    | "CONFIRMED";

    label: string;

}