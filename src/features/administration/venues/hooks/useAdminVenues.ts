import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    Venue,
} from "@/entities/venue";

import {
    loadAdminVenues,
} from "../api/admin-venues.service";

export function useAdminVenues() {

    const [
        venues,
        setVenues,
    ] = useState<Venue[]>(
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

    const load =
        useCallback(
            async () => {

                try {

                    setLoading(true);
                    setError(null);

                    const result =
                        await loadAdminVenues();

                    setVenues(
                        result,
                    );

                }
                catch (error) {

                    console.error(
                        "ADMIN_VENUES_LOAD_FAILED",
                        error,
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "VENUES_LOAD_FAILED",
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [],
        );

    useEffect(() => {

        void load();

    }, [
        load,
    ]);

    return {

        venues,

        loading,

        error,

        reload:
            load,

    };

}