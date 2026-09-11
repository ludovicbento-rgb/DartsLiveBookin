import {
    useState,
} from "react";

import {
    validateReservationService,
} from "../api/validate-reservation.service";

export function useValidateReservation() {

    const [

        loading,

        setLoading,

    ] = useState(false);

    const [

        error,

        setError,

    ] = useState<string | null>(null);

    async function validate(

        reservationId: string,

    ) {

        try {

            setLoading(true);

            setError(null);

            await validateReservationService(

                reservationId,

            );

        }

        catch (e) {

            if (e instanceof Error) {

                setError(e.message);

            }

            else {

                setError(
                    "Impossible de valider.",
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

        validate,

    };

}