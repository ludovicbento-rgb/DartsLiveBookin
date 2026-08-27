import {
    useEffect,
    useState,
} from "react";

import {
    getMatchDays,
    type MatchDay,
} from "@/entities/matchday";

export function useMatchDays(
    competitionId?: string,
    poolId?: string,
) {

    const [
        matchDays,
        setMatchDays,
    ] =
        useState<MatchDay[]>([]);

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    useEffect(() => {

        async function load() {

            if (
                !competitionId ||
                !poolId
            ) {

                setMatchDays([]);

                setLoading(false);

                return;

            }

            const result =
                await getMatchDays(

                    competitionId,

                    poolId,

                );

            result.sort(

                (a, b) =>

                    a.number - b.number,

            );

            setMatchDays(result);

            setLoading(false);

        }

        load();

    }, [

        competitionId,

        poolId,

    ]);

    return {

        matchDays,

        loading,

    };

}