import {
    addDoc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import {
    poolDocument,
    poolsCollection,
} from "./pool.firestore";

import {
    mapPool,
} from "./pool.mapper";

import type {
    Pool,
} from "./pool.types";

export interface CreatePoolRequest {

    competitionId: string;

    name: string;

    order: number;

    active: boolean;

}

export interface UpdatePoolRequest {

    name: string;

    order: number;

    active: boolean;

}

export async function getPool(
    poolId: string,
): Promise<Pool | null> {

    const snapshot =
        await getDoc(
            poolDocument(
                poolId,
            ),
        );

    if (!snapshot.exists()) {

        return null;

    }

    return mapPool(
        snapshot,
    );

}

export async function getPools():
    Promise<Pool[]> {

    const snapshot =
        await getDocs(
            poolsCollection,
        );

    return snapshot.docs.map(
        mapPool,
    );

}

export async function getPoolsByCompetition(
    competitionId: string,
): Promise<Pool[]> {

    const q =
        query(

            poolsCollection,

            where(
                "competitionId",
                "==",
                competitionId,
            ),

        );

    const snapshot =
        await getDocs(
            q,
        );

    return snapshot.docs.map(
        mapPool,
    );

}

export async function createPool(

    request: CreatePoolRequest,

): Promise<string> {

    const document =
        await addDoc(

            poolsCollection,

            {

                competitionId:
                    request.competitionId,

                name:
                    request.name,

                order:
                    request.order,

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

export async function updatePool(

    poolId: string,

    request: UpdatePoolRequest,

): Promise<void> {

    await updateDoc(

        poolDocument(
            poolId,
        ),

        {

            name:
                request.name,

            order:
                request.order,

            active:
                request.active,

            updatedAt:
                serverTimestamp(),

        },

    );

}