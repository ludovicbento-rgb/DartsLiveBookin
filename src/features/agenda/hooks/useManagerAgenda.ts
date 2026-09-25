import {
    useEffect,
    useState,
} from "react";

import {
    subscribeConfirmedReservations,
} from "@/entities/reservation";

import {
    buildManagerAgenda,
} from "../api/agenda.service";

import type {
    AgendaItem,
} from "../model/agenda-item";

export function useManagerAgenda(
    managerUserId?: string,
) {

    const [
        items,
        setItems,
    ] = useState<AgendaItem[]>(
        [],
    );

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

            setItems([]);

            setLoading(false);

            return;

        }

        setLoading(true);

        setError(null);

        /*
         * Chaque snapshot peut déclencher plusieurs
         * lectures asynchrones de contexte Match.
         *
         * generation empêche une ancienne génération
         * de remplacer une snapshot plus récente.
         */
        let generation = 0;

        const unsubscribe =
            subscribeConfirmedReservations(

                reservations => {

                    const currentGeneration =
                        ++generation;

                    void buildManagerAgenda(

                        managerUserId,

                        reservations,

                    )
                        .then(result => {

                            if (
                                currentGeneration
                                !==
                                generation
                            ) {

                                return;

                            }

                            setItems(
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
                                "MANAGER_AGENDA_LOAD_FAILED",
                                error,
                            );

                            setError(

                                error instanceof Error
                                    ? error.message
                                    : "Impossible de charger l'agenda.",

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

        items,

        loading,

        error,

    };

}