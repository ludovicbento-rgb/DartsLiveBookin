import type {
    ReservationSlot,
} from "./reservation-slot";

export interface PlanningBoard {

    boardNumber: number;

    slots: ReservationSlot[];

}