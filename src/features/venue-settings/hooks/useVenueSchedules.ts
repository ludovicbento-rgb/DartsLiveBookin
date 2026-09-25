import {
    useEffect,
    useState,
} from "react";

import {
    subscribeVenueSchedules,
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

        setLoading(true);

        const unsubscribe =
            subscribeVenueSchedules(

                venueId,

                result => {

                    setSchedules(
                        result,
                    );

                    setLoading(
                        false,
                    );

                },

            );

        return () => {

            unsubscribe();

        };

    }, [venueId]);

    return {
        schedules,
        loading,
    };

}