import {
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";

import {
    matchDayDocument,
    matchDaysCollection,
} from "./matchday.firestore";

import {
    mapMatchDay,
} from "./matchday.mapper";

import type {
    MatchDay,
} from "./matchday.types";

export async function getMatchDay(
    matchDayId: string,
): Promise<MatchDay | null> {

    const snapshot =
        await getDoc(
            matchDayDocument(
                matchDayId,
            ),
        );

    if (!snapshot.exists()) {
        return null;
    }

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            MatchDay,
            "id"
        >),

    };

}

export async function getMatchDays(
    competitionId: string,
    poolId: string,
): Promise<MatchDay[]> {

    const q = query(

        matchDaysCollection,

        where(
            "competitionId",
            "==",
            competitionId,
        ),

        where(
            "poolId",
            "==",
            poolId,
        ),

        where(
            "active",
            "==",
            true,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        mapMatchDay,
    );

}