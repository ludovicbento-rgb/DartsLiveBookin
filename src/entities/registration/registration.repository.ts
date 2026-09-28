import {
    addDoc,
    getDocs,
    getDoc,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import {
    registrationsCollection,
    registrationDocument,
} from "./registration.firestore";

import {
    mapRegistration,
} from "./registration.mapper";

import type {
    Registration,
} from "./registration.types";

export interface CreateRegistrationRequest {

    seasonId: string;

    competitionId: string;

    poolId: string;

    registrationName: string;

    captainId: string;

    playerIds: string[];

    homeVenueId: string;

    active: boolean;

}

export interface UpdateRegistrationRequest {

    registrationName: string;

    captainId: string;

    playerIds: string[];

    homeVenueId: string;

    active: boolean;

}

export async function getRegistrations():
    Promise<Registration[]> {

    const snapshot =
        await getDocs(
            registrationsCollection,
        );

    return snapshot.docs.map(
        mapRegistration,
    );

}

export async function createRegistration(

    request: CreateRegistrationRequest,

): Promise<string> {

    const document =
        await addDoc(

            registrationsCollection,

            {

                seasonId:
                    request.seasonId,

                competitionId:
                    request.competitionId,

                poolId:
                    request.poolId,

                registrationName:
                    request.registrationName,

                captainId:
                    request.captainId,

                playerIds:
                    request.playerIds,

                homeVenueId:
                    request.homeVenueId,

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
export async function updateRegistration(

    registrationId: string,

    request: UpdateRegistrationRequest,

): Promise<void> {

    await updateDoc(

        registrationDocument(
            registrationId,
        ),

        {

            registrationName:
                request.registrationName,

            captainId:
                request.captainId,

            playerIds:
                request.playerIds,

            homeVenueId:
                request.homeVenueId,

            active:
                request.active,

            updatedAt:
                serverTimestamp(),

        },

    );

}

export async function getRegistrationsByPlayer(
    playerId: string,
): Promise<Registration[]> {

    const q = query(

        registrationsCollection,

        where(
            "playerIds",
            "array-contains",
            playerId,
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
        mapRegistration,
    );

}

export async function getAllRegistrationsByCompetition(

    competitionId: string,

    poolId: string,

): Promise<Registration[]> {

    const q =
        query(

            registrationsCollection,

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
        mapRegistration,
    );

}

export async function getRegistrationsByCompetition(
    competitionId: string,
    poolId: string,
): Promise<Registration[]> {

    const q = query(

        registrationsCollection,

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
        mapRegistration,
    );

}

export async function getRegistration(
    registrationId: string,
): Promise<Registration | null> {

    const snapshot =
        await getDoc(
            registrationDocument(
                registrationId,
            ),
        );

    if (!snapshot.exists()) {

        return null;

    }

    return {

        id: snapshot.id,

        ...(snapshot.data() as Omit<
            Registration,
            "id"
        >),

    };

}

export async function getOpponentRegistrations(
    registrationId: string,
): Promise<Registration[]> {

    const registration =
        await getRegistration(
            registrationId,
        );

    if (!registration) {
        return [];
    }

    const registrations =
        await getRegistrationsByCompetition(

            registration.competitionId,

            registration.poolId,

        );

    return registrations.filter(

        opponent =>

            opponent.id !==
            registration.id,

    );

}