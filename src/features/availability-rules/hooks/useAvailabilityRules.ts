import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    AvailabilityRule,
} from "@/entities/availability-rule";

import {
    loadAvailabilityRules,
} from "../api/availability-rule.service";

export function useAvailabilityRules(

    venueId: string,

) {

    const [

        rules,

        setRules,

    ] = useState<AvailabilityRule[]>([]);

    const [

        loading,

        setLoading,

    ] = useState(true);

    const [

        error,

        setError,

    ] = useState<string | null>(null);

    const reload = useCallback(

        async () => {

            if (!venueId) {

                setRules([]);

                setLoading(false);

                return;

            }

            setLoading(true);

            setError(null);

            try {

                const result =

                    await loadAvailabilityRules(

                        venueId,

                    );

                setRules(

                    result,

                );

            }

            catch (e) {

                if (e instanceof Error) {

                    setError(

                        e.message,

                    );

                }

                else {

                    setError(

                        "Impossible de charger les règles.",

                    );

                }

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

        rules,

        loading,

        error,

        reload,

    };

}

