import {
    useEffect,
    useState,
} from "react";

import {
    getMatchesByMatchDay,
    type Match,
} from "@/entities/match";

export function useMatches(
    matchDayId?: string,
) {

    const [
        matches,
        setMatches,
    ] =
        useState<Match[]>([]);

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    useEffect(() => {

        async function load() {

            if (!matchDayId) {

                setMatches([]);

                setLoading(false);

                return;

            }

            const result =
                await getMatchesByMatchDay(
                    matchDayId,
                );

            result.sort(

                (a, b) =>

                    a.id.localeCompare(
                        b.id,
                    ),

            );

            setMatches(result);

            setLoading(false);

        }

        load();

    }, [

        matchDayId,

    ]);

    return {

        matches,

        loading,

    };

}