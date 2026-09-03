import {
    useEffect,
    useState,
} from "react";

import {
    createPlanning,
} from "../api/planning.service";

import type {
    VenuePlanning,
} from "../model/planning.types";
import { loadPlanningData } from "../api/planning.loader";

export function usePlanning(

    venueId: string,

    reservationDate: Date,

) {

    const [

        planning,

        setPlanning,

    ] = useState<VenuePlanning | null>(

        null,

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

        async function load() {

            try {

                setLoading(true);

                setError(null);

                /*
                 * TODO PR-068
                 * Charger :
                 *   - venue
                 *   - schedules
                 *   - reservations
                 */
                const data = await loadPlanningData(
                    venueId,
                    reservationDate,
                );
                const result = createPlanning(
                    data,
                    reservationDate,
                );

                setPlanning(

                    result.planning,

                );

            }

            catch (e) {

                if (e instanceof Error) {

                    setError(

                        e.message,

                    );

                }

            }

            finally {

                setLoading(false);

            }

        }

        load();

    }, [

        venueId,

        reservationDate,

    ]);

    return {

        planning,

        loading,

        error,

    };

}