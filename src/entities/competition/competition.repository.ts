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
    competitionDocument,
    competitionsCollection,
} from "./competition.firestore";

import {
    mapCompetition,
} from "./competition.mapper";

import type {
    Competition,
    CompetitionMode,
} from "./competition.types";

export interface CreateCompetitionRequest {

    seasonId: string;

    name: string;

    mode: CompetitionMode;

    active: boolean;

}

export interface UpdateCompetitionRequest {

    name: string;

    mode: CompetitionMode;

    active: boolean;

}

export async function getCompetition(
    competitionId: string,
): Promise<Competition | null> {

    const snapshot =
        await getDoc(
            competitionDocument(
                competitionId,
            ),
        );

    if (!snapshot.exists()) {

        return null;

    }

    return mapCompetition(
        snapshot,
    );

}

export async function getCompetitions():
    Promise<Competition[]> {

    const snapshot =
        await getDocs(
            competitionsCollection,
        );

    return snapshot.docs.map(
        mapCompetition,
    );

}

export async function getCompetitionsBySeason(
    seasonId: string,
): Promise<Competition[]> {

    const q =
        query(

            competitionsCollection,

            where(
                "seasonId",
                "==",
                seasonId,
            ),

        );

    const snapshot =
        await getDocs(
            q,
        );

    return snapshot.docs.map(
        mapCompetition,
    );

}

export async function createCompetition(

    request: CreateCompetitionRequest,

): Promise<string> {

    const document =
        await addDoc(

            competitionsCollection,

            {

                seasonId:
                    request.seasonId,

                name:
                    request.name,

                mode:
                    request.mode,

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

export async function updateCompetition(

    competitionId: string,

    request: UpdateCompetitionRequest,

): Promise<void> {

    await updateDoc(

        competitionDocument(
            competitionId,
        ),

        {

            name:
                request.name,

            mode:
                request.mode,

            active:
                request.active,

            updatedAt:
                serverTimestamp(),

        },

    );

}   