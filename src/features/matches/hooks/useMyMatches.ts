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
    playerId?: string,
) {
    console.log("useMyMatches", playerId);
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

    async function load() {

        if (!playerId) {

            setLoading(false);

            return;

        }

        setLoading(true);

        const result =
            await loadMyMatches(
                playerId,
            );

        setMatches(result);

        setLoading(false);

    }

    useEffect(() => {

        load();

    }, [playerId]);

    return {

        matches,

        loading,

        reload: load,

    };

} 