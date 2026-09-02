import {
    useEffect,
    useState,
} from "react";

import {
    getVenueSchedules,
} from "@/entities/venue-schedule";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

export function useVenueSchedules(
    venueId: string,
) {

    const [
        schedules,
        setSchedules,
    ] = useState<
        VenueSchedule[]
    >([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    useEffect(() => {

        if (!venueId) {

            setSchedules([]);

            setLoading(false);

            return;

        }

        let cancelled = false;

        async function load() {

            setLoading(true);

            try {

                const result =
                    await getVenueSchedules(
                        venueId,
                    );

                if (!cancelled) {

                    setSchedules(
                        result,
                    );

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

    }, [venueId]);

    return {

        schedules,

        loading,

    };

}