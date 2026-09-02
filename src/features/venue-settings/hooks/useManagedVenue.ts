import {
    useEffect,
    useState,
} from "react";

import {
    getManagedVenue,
} from "@/entities/venue";

import type {
    Venue,
} from "@/entities/venue";

export function useManagedVenue(

    userId: string,

) {

    const [

        venue,

        setVenue,

    ] = useState<Venue | null>(
        null,
    );

    const [

        loading,

        setLoading,

    ] = useState(true);

    useEffect(() => {

        if (!userId) {

            setVenue(null);

            setLoading(false);

            return;

        }

        let cancelled = false;

        async function load() {

            setLoading(true);

            try {

                const result =
                    await getManagedVenue(
                        userId,
                    );

                if (!cancelled) {

                    setVenue(result);

                }

            }

            finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        }

        load();

        return () => {

            cancelled = true;

        };

    }, [userId]);

    return {

        venue,

        loading,

    };

}