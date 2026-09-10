import {
    useState,
} from "react";

import {
    cancelReservationService,
} from "../api/cancel-reservation.service";

export function useCancelReservation() {

    const [

        loading,

        setLoading,

    ] = useState(false);

    const [

        error,

        setError,

    ] = useState<string | null>(

        null,

    );

    const [

        success,

        setSuccess,

    ] = useState(false);

    async function cancel(
        reservationId: string,
    ) {

        try {

            setLoading(true);

            setError(null);

            setSuccess(false);

            await cancelReservationService(
                reservationId,
            );

            setSuccess(true);

        }

        catch (e) {

            if (e instanceof Error) {

                setError(e.message);

            }

            else {

                setError(
                    "Impossible d'annuler.",
                );

            }

            throw e;

        }

        finally {

            setLoading(false);

        }

    }

    return {

        loading,

        error,

        success,

        cancel,

    };

}