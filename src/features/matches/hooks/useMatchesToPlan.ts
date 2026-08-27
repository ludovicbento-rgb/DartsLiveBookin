import {
    useEffect,
    useState,
} from "react";

import {
    loadMatchesToPlan,
} from "../api/match-list.service";

import type {
    MatchListItem,
} from "../model/match-list-item";

export function useMatchesToPlan(
    registrationId?: string,
) {

    const [
        matches,
        setMatches,
    ] =
        useState<MatchListItem[]>([]);

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    useEffect(() => {

        async function load() {

            if (!registrationId) {

                setMatches([]);

                setLoading(false);

                return;

            }

            const result =
                await loadMatchesToPlan(
                    registrationId,
                );

            setMatches(result);

            setLoading(false);

        }

        load();

    }, [registrationId]);

    return {

        matches,

        loading,

    };

}