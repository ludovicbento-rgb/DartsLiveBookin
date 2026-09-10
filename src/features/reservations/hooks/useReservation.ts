import {
    useEffect,
    useState,
} from "react";

import {
    getReservation,
} from "@/entities/reservation";

import type {
    Reservation,
} from "@/entities/reservation";

interface UseReservationResult {

    reservation: Reservation | null;

    loading: boolean;

    error: string | null;

    reload(): Promise<void>;

}

export function useReservation(

    reservationId?: string | null,

): UseReservationResult {

    const [

        reservation,

        setReservation,

    ] = useState<Reservation | null>(

        null,

    );

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

    async function load() {

        if (!reservationId) {

            setReservation(null);

            return;

        }

        try {

            setLoading(true);

            setError(null);

            const result =

                await getReservation(

                    reservationId,

                );

            setReservation(

                result,

            );

        }

        catch (e) {

            if (

                e instanceof Error

            ) {

                setError(

                    e.message,

                );

            }

            else {

                setError(

                    "Impossible de charger la réservation.",

                );

            }

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        load();

    }, [

        reservationId,

    ]);

    return {

        reservation,

        loading,

        error,

        reload: load,

    };

}

export default useReservation;