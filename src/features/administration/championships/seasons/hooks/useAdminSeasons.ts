import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    Season,
} from "@/entities/season";

import {
    loadAdminSeasons,
} from "../api/admin-seasons.service";

export function useAdminSeasons() {

    const [
        seasons,
        setSeasons,
    ] = useState<Season[]>(
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
                        await loadAdminSeasons();

                    setSeasons(
                        result,
                    );

                }
                catch (error) {

                    console.error(
                        "ADMIN_SEASONS_LOAD_FAILED",
                        error,
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "SEASONS_LOAD_FAILED",
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

        seasons,

        loading,

        error,

        reload:
            load,

    };

}