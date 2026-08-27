import {
    useEffect,
    useState,
} from "react";

import {
    subscribePlanning,
} from "../api/planning.service";

import type {
    VenuePlanning,
} from "../model/planning.types";

export function usePlanning(
    venueId: string,
) {

    const [
        planning,
        setPlanning,
    ] =
        useState<VenuePlanning | null>(
            null,
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        error,
    ] = useState<string | null>(null);

    useEffect(() => {

        if (!venueId) {
            setLoading(false);
            return;
        }

        const unsubscribe =
            subscribePlanning(
                venueId,
                planning => {

                    setPlanning(planning);

                    setLoading(false);

                },
            );

        return unsubscribe;

    }, [venueId]);

    return {

        planning,

        loading,

        error,

    };

}