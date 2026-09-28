import {
    addDoc,
    Timestamp,
    serverTimestamp,
    updateDoc,
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

export async function getAllMatchDays(

    competitionId: string,

    poolId: string,

): Promise<MatchDay[]> {

    const q =
        query(

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

        );

    const snapshot =
        await getDocs(
            q,
        );

    return snapshot.docs.map(
        mapMatchDay,
    );

}

export async function createMatchDay(

    request: CreateMatchDayRequest,

): Promise<string> {

    const document =
        await addDoc(

            matchDaysCollection,

            {

                seasonId:
                    request.seasonId,

                competitionId:
                    request.competitionId,

                poolId:
                    request.poolId,

                number:
                    request.number,

                displayName:
                    request.displayName,

                officialDate:
                    request.officialDate,

                active:
                    request.active,

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp(),

            },

        );

    return document.id;

}
export async function updateMatchDay(

    matchDayId: string,

    request: UpdateMatchDayRequest,

): Promise<void> {

    await updateDoc(

        matchDayDocument(
            matchDayId,
        ),

        {

            number:
                request.number,

            displayName:
                request.displayName,

            officialDate:
                request.officialDate,

            active:
                request.active,

            updatedAt:
                serverTimestamp(),

        },

    );

}

export interface CreateMatchDayRequest {

    seasonId: string;

    competitionId: string;

    poolId: string;

    number: number;

    displayName: string;

    officialDate: Timestamp;

    active: boolean;

}

export interface UpdateMatchDayRequest {

    number: number;

    displayName: string;

    officialDate: Timestamp;

    active: boolean;

}

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