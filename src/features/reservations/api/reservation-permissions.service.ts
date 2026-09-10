import type {
    Reservation,
} from "@/entities/reservation";

export interface ReservationPermissions {

    canCancel: boolean;

}

interface Input {

    reservation: Reservation;

    isPlayerOfMatch: boolean;

}

export function getReservationPermissions({

    reservation,

    isPlayerOfMatch,

}: Input): ReservationPermissions {

    const isFuture =

        reservation.plannedStartAt.toDate() >

        new Date();

    return {

        canCancel:

            isPlayerOfMatch &&

            reservation.status !== "CANCELLED" &&

            isFuture,

    };

}