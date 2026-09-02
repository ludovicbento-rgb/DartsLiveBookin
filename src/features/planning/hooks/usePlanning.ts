import {
    useEffect,
    useState,
} from "react";

import type {
    VenuePlanning,
} from "../model/planning.types";

export function usePlanning(

    venueId: string,

    reservationDate: Date,

) {

    const [

        planning,

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

                throw new Error("Planning service not integrated yet");

            }
            catch (e) {

                if (e instanceof Error) {

                    setError(e.message);

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