import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    loadPendingReservations,
} from "../api/reservation-validation.service";

import type {
    ReservationValidationItem,
} from "../model/reservation-validation-item";

export function usePendingReservations(
    managerUserId: string,
) {

    const [
        reservations,
        setReservations,
    ] = useState<ReservationValidationItem[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    const load = useCallback(async () => {

        if (!managerUserId) {

            setReservations([]);

            setLoading(false);

            return;

        }

        setLoading(true);

        setError(null);

        try {

            const result =
                await loadPendingReservations(
                    managerUserId,
                );

            setReservations(result);

        }

        catch (e) {

            if (e instanceof Error) {

                setError(e.message);

            }

            else {

                setError(
                    "Impossible de charger les réservations.",
                );

            }

        }

        finally {

            setLoading(false);

        }

    }, [

        managerUserId,

    ]);

    useEffect(() => {

        void load();

    }, [

        load,

    ]);

    return {

        reservations,

        loading,

        error,

        reload: load,

    };

}