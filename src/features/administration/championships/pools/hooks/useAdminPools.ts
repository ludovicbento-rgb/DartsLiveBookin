import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    Pool,
} from "@/entities/pool";

import {
    loadAdminPools,
} from "../api/admin-pools.service";

export function useAdminPools(
    competitionId: string,
) {

    const [
        pools,
        setPools,
    ] = useState<Pool[]>(
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
                        await loadAdminPools(
                            competitionId,
                        );

                    setPools(
                        result,
                    );

                }
                catch (error) {

                    console.error(
                        "ADMIN_POOLS_LOAD_FAILED",
                        error,
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "POOLS_LOAD_FAILED",
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [
                competitionId,
            ],
        );

    useEffect(() => {

        void load();

    }, [
        load,
    ]);

    return {

        pools,

        loading,

        error,

        reload:
            load,

    };

}