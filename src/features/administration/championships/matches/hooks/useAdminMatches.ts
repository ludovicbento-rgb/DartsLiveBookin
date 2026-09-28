import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    Match,
} from "@/entities/match";

import {
    loadAdminMatches,
} from "../api/admin-matches.service";

export function useAdminMatches(
    matchDayId: string,
) {

    const [
        matches,
        setMatches,
    ] = useState<Match[]>(
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

                    setMatches(
                        await loadAdminMatches(
                            matchDayId,
                        ),
                    );

                }
                catch (error) {

                    console.error(
                        "ADMIN_MATCHES_LOAD_FAILED",
                        error,
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "MATCHES_LOAD_FAILED",
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [
                matchDayId,
            ],
        );

    useEffect(() => {

        void load();

    }, [
        load,
    ]);

    return {

        matches,

        loading,

        error,

        reload:
            load,

    };

}