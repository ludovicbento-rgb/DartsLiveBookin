import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    Competition,
} from "@/entities/competition";

import {
    loadAdminCompetitions,
} from "../api/admin-competitions.service";

export function useAdminCompetitions(
    seasonId: string,
) {

    const [
        competitions,
        setCompetitions,
    ] = useState<Competition[]>(
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
                        await loadAdminCompetitions(
                            seasonId,
                        );

                    setCompetitions(
                        result,
                    );

                }
                catch (error) {

                    console.error(
                        "ADMIN_COMPETITIONS_LOAD_FAILED",
                        error,
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "COMPETITIONS_LOAD_FAILED",
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [
                seasonId,
            ],
        );

    useEffect(() => {

        void load();

    }, [
        load,
    ]);

    return {

        competitions,

        loading,

        error,

        reload:
            load,

    };

}