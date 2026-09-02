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

    useEffect(() => {

        async function load() {
            console.log("useEffect lancé");
            if (!playerId) {

                setLoading(false);

                return;

            }
            console.log("Appel de loadMyMatches");
            const result =
                await loadMyMatches(
                    playerId,
                );

            setMatches(result);

            setLoading(false);

        }

        load();

    }, [playerId]);

    return {

        matches,

        loading,

    };

}