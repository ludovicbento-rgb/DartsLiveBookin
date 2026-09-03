import {
    useEffect,
    useState,
} from "react";

import {
    getMatchPlanningContext,
} from "@/features/commands/match-planning.service";

export function useMatchPlanningContext(

    matchId: string | null,

) {

    const [

        selectedMatch,

        setSelectedMatch,

    ] = useState<

        Awaited<

            ReturnType<
                typeof getMatchPlanningContext
            >

        > | null

    >(null);

    const [

        loading,

        setLoading,

    ] = useState(false);

    const [

        error,

        setError,

    ] = useState<string | null>(

        null,

    );

    useEffect(() => {

        if (!matchId) {

            setSelectedMatch(null);

            return;

        }

        let cancelled = false;

        async function load() {

            try {

                setLoading(true);

                setError(null);

                if (!matchId) {

                    return;

                }

                const context =

                    await getMatchPlanningContext(

                        matchId,

                    );

                if (!cancelled) {

                    setSelectedMatch(

                        context,

                    );

                }

            }

            catch (e) {

                if (

                    !cancelled &&

                    e instanceof Error

                ) {

                    setError(

                        e.message,

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

    }, [

        matchId,

    ]);

    return {

        selectedMatch,

        loading,

        error,

    };

}