import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    MatchDay,
} from "@/entities/matchday";

import {
    loadAdminMatchDays,
} from "../api/admin-matchdays.service";

export function useAdminMatchDays(

    competitionId: string,

    poolId: string,

) {

    const [
        matchDays,
        setMatchDays,
    ] = useState<MatchDay[]>([]);

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

                    setMatchDays(
                        await loadAdminMatchDays(
                            competitionId,
                            poolId,
                        ),
                    );

                }
                catch (error) {

                    console.error(
                        "ADMIN_MATCHDAYS_LOAD_FAILED",
                        error,
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "MATCHDAYS_LOAD_FAILED",
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [
                competitionId,
                poolId,
            ],
        );

    useEffect(() => {

        void load();

    }, [
        load,
    ]);

    return {

        matchDays,

        loading,

        error,

        reload:
            load,

    };

}