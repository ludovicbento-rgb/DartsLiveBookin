import { useEffect, useState } from "react";

import { loadDashboard } from "../api/dashboard.service";

import type { DashboardData } from "../model/dashboard.types";

export function useDashboard() {

    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {

        async function load() {

            try {

                const data =
                    await loadDashboard();

                setDashboard(data);

            }
            catch (e) {

                if (e instanceof Error) {

                    setError(e.message);

                } else {

                    setError(
                        "Une erreur est survenue.",
                    );

                }

            }
            finally {

                setLoading(false);

            }

        }

        load();

    }, []);

    return {

        dashboard,

        loading,

        error,

    };

}