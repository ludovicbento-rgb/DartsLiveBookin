import {
    useEffect,
    useState,
} from "react";

import {
    subscribePendingMatches,
} from "@/entities/match";

import {
    buildPendingReservations,
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

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    );

    useEffect(() => {

        if (!managerUserId) {

            setReservations([]);

            setLoading(false);

            return;

        }

        setLoading(true);

        setError(null);

        let generation = 0;

        const unsubscribe =
            subscribePendingMatches(

                pendingMatches => {

                    const currentGeneration =
                        ++generation;

                    void buildPendingReservations(
                        managerUserId,
                        pendingMatches,
                    )
                        .then(result => {

                            /*
                             * Évite qu'une ancienne réponse
                             * async écrase une snapshot plus récente.
                             */
                            if (
                                currentGeneration
                                !==
                                generation
                            ) {

                                return;

                            }

                            setReservations(
                                result,
                            );

                            setLoading(
                                false,
                            );

                        })
                        .catch(error => {

                            if (
                                currentGeneration
                                !==
                                generation
                            ) {

                                return;

                            }

                            console.error(
                                "PENDING_RESERVATIONS_LOAD_FAILED",
                                error,
                            );

                            setError(
                                error instanceof Error
                                    ? error.message
                                    : "Impossible de charger les réservations.",
                            );

                            setLoading(
                                false,
                            );

                        });

                },

            );

        return () => {

            generation++;

            unsubscribe();

        };

    }, [
        managerUserId,
    ]);

    return {

        reservations,

        loading,

        error,

    };

}