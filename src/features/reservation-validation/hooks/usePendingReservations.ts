import {
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
    ] = useState<
        ReservationValidationItem[]
    >([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    useEffect(() => {

        if (!managerUserId) {

            setReservations([]);

            setLoading(false);

            return;

        }

        let cancelled = false;

        async function load() {

            setLoading(true);

            try {

                const result =
                    await loadPendingReservations(
                        managerUserId,
                    );

                if (!cancelled) {

                    setReservations(
                        result,
                    );

                }

            }
            finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        }

        load();

        return () => {

            cancelled = true;

        };

    }, [managerUserId]);

    return {

        reservations,

        loading,

    };

}