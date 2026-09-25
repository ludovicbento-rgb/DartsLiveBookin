import {
    useEffect,
    useState,
} from "react";

import {
    loadDashboard,
} from "../api/dashboard.service";

import type {
    DashboardData,
} from "../model/dashboard.types";

export function useDashboard(
    managerUserId?: string,
) {

    const [
        dashboard,
        setDashboard,
    ] = useState<DashboardData | null>(
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

        let cancelled =
            false;

        async function load() {

            try {

                setLoading(true);

                setError(null);

                const data =
                    await loadDashboard(
                        managerUserId,
                    );

                if (!cancelled) {

                    setDashboard(
                        data,
                    );

                }

            }
            catch (error) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "DASHBOARD_LOAD_FAILED",
                    error,
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Impossible de charger le tableau de bord.",
                );

            }
            finally {

                if (!cancelled) {

                    setLoading(
                        false,
                    );

                }

            }

        }

        void load();

        return () => {

            cancelled =
                true;

        };

    }, [
        managerUserId,
    ]);

    return {

        dashboard,

        loading,

        error,

    };

}