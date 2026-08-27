import {
    getDocs,
    getDoc,
    query,
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