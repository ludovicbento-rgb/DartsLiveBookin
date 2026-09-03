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

    planning: VenuePlanning | null;

    suggestion: ReturnType<
        typeof findBestSlot
    > | null;

    loading: boolean;

    error: string | null;

}

export function usePlanning(

    venueId: string,

    reservationDate: Date,

): UsePlanningResult {

    const [

        planning,

        setPlanning,

    ] = useState<VenuePlanning | null>(

        null,

    );

    const [

        suggestion,

        setSuggestion,

    ] = useState<
        ReturnType<
            typeof findBestSlot
        > | null
    >(null);

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

        let cancelled = false;

        async function load() {

            try {

                setLoading(true);

                setError(null);

                const data = await loadPlanningData(

                    venueId,

                    reservationDate,

                );

                const result = createPlanning(

                    data,

                    reservationDate,

                );

                if (!cancelled) {

                    setPlanning(

                        result.planning,

                    );

                    setSuggestion(

                        result.suggestion,

                    );

                }

            }

            catch (e) {

                if (

                    !cancelled &&

                    e instanceof Error

                ) {

                    setError(

                        e.message,

                    );

                }

            }

            finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        }

        if (venueId) {

            load();

        }

        return () => {

            cancelled = true;

        };

    }, [

        venueId,

        reservationDate,

    ]);

    return {

        planning,

        suggestion,

        loading,

        error,

    };

}