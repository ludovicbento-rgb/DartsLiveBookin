import {
    useEffect,
    useState,
} from "react";

import {
    loadMyMatches,
} from "../api/my-matches.service";

import type {
    MyMatch,
} from "../model/my-match";

export function useMyMatches(
    playerUid?: string,
) {

    const [
        matches,
        setMatches,
    ] =
        useState<MyMatch[]>([]);

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    useEffect(() => {

        async function load() {

            if (!playerUid) {

                setLoading(false);

                return;

            }

            const result =
                await loadMyMatches(
                    playerUid,
                );

            setMatches(result);

            setLoading(false);

        }

        load();

    }, [playerUid]);

    return {

        matches,

        loading,

    };

}