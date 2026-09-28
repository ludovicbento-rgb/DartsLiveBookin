import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    Registration,
} from "@/entities/registration";

import {
    loadAdminRegistrations,
} from "../api/admin-registrations.service";

export function useAdminRegistrations(

    competitionId: string,

    poolId: string,

) {

    const [
        registrations,
        setRegistrations,
    ] = useState<Registration[]>(
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
                        await loadAdminRegistrations(
                            competitionId,
                            poolId,
                        );

                    setRegistrations(
                        result,
                    );

                }
                catch (error) {

                    console.error(
                        "ADMIN_REGISTRATIONS_LOAD_FAILED",
                        error,
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "REGISTRATIONS_LOAD_FAILED",
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

        registrations,

        loading,

        error,

        reload:
            load,

    };

}