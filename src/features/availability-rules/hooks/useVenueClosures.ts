import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    VenueClosure,
} from "@/entities/venue-closure";

import {
    loadVenueClosures,
} from "../api/venue-closure.service";

export function useVenueClosures(
    venueId: string,
) {

    const [
        closures,
        setClosures,
    ] = useState<VenueClosure[]>([]);

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

    const reload = useCallback(

        async () => {

            if (!venueId) {

                setClosures([]);

                setLoading(false);

                return;

            }

            setLoading(true);
            setError(null);

            try {

                const result =
                    await loadVenueClosures(
                        venueId,
                    );

                setClosures(
                    result,
                );

            }
            catch (error) {

                console.error(
                    "LOAD_VENUE_CLOSURES_FAILED",
                    error,
                );

                setError(
                    "Impossible de charger les fermetures exceptionnelles.",
                );

            }
            finally {

                setLoading(false);

            }

        },

        [
            venueId,
        ],

    );

    useEffect(() => {

        void reload();

    }, [
        reload,
    ]);

    return {

        closures,

        loading,

        error,

        reload,

    };

}