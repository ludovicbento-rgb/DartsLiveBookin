import {
    useState,
} from "react";

import {
    validateReservationCommand,
} from "@/features/commands/validateReservation";

import {
    rejectReservationCommand,
} from "@/features/commands/rejectReservation";

import type {
    ReservationValidationItem,
} from "../model/reservation-validation-item";

export function useReservationValidation() {

    const [
        loading,
        setLoading,
    ] = useState(false);

    async function accept(
        reservation: ReservationValidationItem,
    ) {

        setLoading(true);

        try {

            await validateReservationCommand(

                reservation.reservationId,

                reservation.matchId,

            );

        }

        finally {

            setLoading(false);

        }

    }

    async function reject(
        reservation: ReservationValidationItem,

        reason: string,

    ) {

        setLoading(true);

        try {

            await rejectReservationCommand(

                reservation.reservationId,

                reservation.matchId,

                reason,

            );

        }

        finally {

            setLoading(false);

        }

    }

    return {

        loading,

        accept,

        reject,

    };

}