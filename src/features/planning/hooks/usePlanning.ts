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

                const result = createPlanning({

                    venueId,

                    venueName: "",

                    openingHours: {

                        openTime: "18:00",

                        closeTime: "22:30",

                        boardNumbers: [1, 2],

                    },

                    matchDurationMinutes: 90,

                    reservations: [],

                });

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