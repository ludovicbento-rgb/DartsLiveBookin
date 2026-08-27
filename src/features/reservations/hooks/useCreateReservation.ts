import { useState } from "react";

import {

    createReservation,

    type ReservationResult,

} from "../api/reservation.service";

import type {

    ReservationCommand,

} from "../model/reservation-command";

export function useCreateReservation() {

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [result, setResult] =
        useState<ReservationResult | null>(null);

    async function create(
        command: ReservationCommand,
    ): Promise<ReservationResult> {

        setLoading(true);

        setError(null);

        setResult(null);

        try {

            const reservation =
                await createReservation(
                    command,
                );

            setResult(reservation);

            return reservation;

        }
        catch (e) {

            if (e instanceof Error) {

                setError(e.message);

            }
            else {

                setError(
                    "Une erreur est survenue.",
                );

            }

            throw e;

        }
        finally {

            setLoading(false);

        }

    }

    function reset() {

        setResult(null);

        setError(null);

    }

    return {

        create,

        loading,

        error,

        result,

        reset,

    };

}