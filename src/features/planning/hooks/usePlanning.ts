import {
    useEffect,
    useState,
} from "react";

import {
    findBestSlot,
} from "@/core/booking-engine";

import {
    createPlanning,
} from "../api/planning.service";

import {
    loadPlanningData,
} from "../api/planning.loader";

import type {
    VenuePlanning,
} from "../model/planning.types";

interface UsePlanningResult {

    planning:
    VenuePlanning | null;

    suggestion:
    ReturnType<
        typeof findBestSlot
    > | null;

    loading:
    boolean;

    error:
    string | null;

}

export function usePlanning(

    venueId: string,

    reservationDate: Date,

    durationMinutes: number,

): UsePlanningResult {

    const [
        planning,
        setPlanning,
    ] =
        useState<VenuePlanning | null>(
            null,
        );

    const [
        suggestion,
        setSuggestion,
    ] =
        useState<
            ReturnType<
                typeof findBestSlot
            > | null
        >(
            null,
        );

    const [
        loading,
        setLoading,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );

    useEffect(() => {

        let cancelled =
            false;

        /*
         * ========================================================
         * CONTEXTE INCOMPLET
         * ========================================================
         *
         * Le contexte du match est chargé séparément.
         *
         * Au premier rendu :
         *
         * selectedMatch = null
         * durationMinutes = 0
         *
         * Il ne faut donc surtout pas lancer le moteur
         * tant que la durée de la compétition n'est
         * pas disponible.
         */

        if (
            !venueId
            ||
            !Number.isFinite(
                durationMinutes,
            )
            ||
            durationMinutes <= 0
        ) {

            setPlanning(
                null,
            );

            setSuggestion(
                null,
            );

            setError(
                null,
            );

            setLoading(
                false,
            );

            return () => {

                cancelled =
                    true;

            };

        }

        async function load() {

            try {

                setLoading(
                    true,
                );

                setError(
                    null,
                );

                /*
                 * On efface l'ancien planning.
                 *
                 * Important notamment si la durée
                 * change avec la compétition.
                 */
                setPlanning(
                    null,
                );

                setSuggestion(
                    null,
                );

                const data =
                    await loadPlanningData(

                        venueId,

                        reservationDate,

                    );

                const result =
                    createPlanning(

                        data,

                        reservationDate,

                        durationMinutes,

                    );

                if (cancelled) {

                    return;

                }

                setPlanning(
                    result.planning,
                );

                setSuggestion(
                    result.suggestion,
                );

            }
            catch (error) {

                if (
                    cancelled
                ) {

                    return;

                }

                setPlanning(
                    null,
                );

                setSuggestion(
                    null,
                );

                setError(

                    error instanceof Error

                        ? error.message

                        : "PLANNING_LOAD_FAILED",

                );

            }
            finally {

                if (
                    !cancelled
                ) {

                    setLoading(
                        false,
                    );

                }

            }

        }

        void load();

        return () => {

            cancelled =
                true;

        };

    }, [

        venueId,

        reservationDate,

        /*
         * CRITIQUE :
         *
         * Le planning doit être recalculé lorsque
         * la durée de la compétition devient disponible
         * ou change.
         */
        durationMinutes,

    ]);
    return {

        planning,

        suggestion,

        loading,

        error,

    };

}       