import {
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
} from "firebase/firestore";

import {
    matchDocument,
    matchesCollection,
} from "./match.firestore";

import {
    mapMatch,
} from "./match.mapper";

import type {
    Match,
    MatchStatus,
} from "./match.types";

export async function getMatch(
    matchId: string,
): Promise<Match | null> {

    const snapshot =
        await getDoc(
            matchDocument(matchId),
        );

    if (!snapshot.exists()) {
        return null;
    }

    return mapMatch(snapshot);

}

export async function getMatchesByMatchDay(
    matchDayId: string,
): Promise<Match[]> {

    const q = query(

        matchesCollection,

        where(
            "matchDayId",
            "==",
            matchDayId,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        mapMatch,
    );

}

export async function getMatchesByStatus(
    status: MatchStatus,
): Promise<Match[]> {

    const q = query(

        matchesCollection,

        where(
            "status",
            "==",
            status,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        mapMatch,
    );

}

export async function getMatchesToValidate(
): Promise<Match[]> {

    return getMatchesByStatus(
        "PENDING",
    );

}

export async function getMatchByRegistrations(
    homeRegistrationId: string,
    awayRegistrationId: string,
): Promise<Match | null> {

    const q = query(

        matchesCollection,

        where(
            "homeRegistrationId",
            "==",
            homeRegistrationId,
        ),

        where(
            "awayRegistrationId",
            "==",
            awayRegistrationId,
        ),

    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty) {

        return null;

    }

    return mapMatch(
        snapshot.docs[0],
    );

}

export async function getMatchesByHomeRegistration(
    registrationId: string,
): Promise<Match[]> {

    const q = query(

        matchesCollection,

        where(
            "homeRegistrationId",
            "==",
            registrationId,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        mapMatch,
    );

}

export async function getMatchesByAwayRegistration(
    registrationId: string,
): Promise<Match[]> {

    const q = query(

        matchesCollection,

        where(
            "awayRegistrationId",
            "==",
            registrationId,
        ),

    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        mapMatch,
    );

}

export async function getPlannedMatches(): Promise<Match[]> {

    return getMatchesByStatus(
        "PLANNED",
    );

}

export async function getPendingMatches(): Promise<Match[]> {

    return getMatchesByStatus(
        "PENDING",
    );

}

export async function getMatchesToPlanByRegistration(
    registrationId: string,
): Promise<Match[]> {

    const home =
        await getMatchesByHomeRegistration(
            registrationId,
        );

    return home.filter(
        match =>
            match.status ===
            "NOT_PLANNED",
    );

}

export async function getMatchByReservation(
    reservationId: string,
): Promise<Match | null> {

    const q = query(

        matchesCollection,

        where(
            "plannedReservationId",
            "==",
            reservationId,
        ),

    );

    const snapshot =
        await getDocs(q);

    if (snapshot.empty) {

        return null;

    }

    return mapMatch(
        snapshot.docs[0],
    );

}

export async function updateMatchStatus(
    matchId: string,
    status: MatchStatus,
    plannedReservationId: string | null,
): Promise<void> {

    await updateDoc(

        matchDocument(matchId),

        {

            status,

            plannedReservationId,

        },

    );

}

export async function getMatchesByRegistration(
    registrationId: string,
): Promise<Match[]> {

    const home =
        await getMatchesByHomeRegistration(
            registrationId,
        );

    const away =
        await getMatchesByAwayRegistration(
            registrationId,
        );

    return [

        ...home,

        ...away,

    ];

}

export async function attachReservation(
    matchId: string,
    reservationId: string,
): Promise<void> {

    await updateDoc(

        matchDocument(matchId),

        {

            status: "PENDING",

            plannedReservationId:
                reservationId,

        },

    );

}

export async function detachReservation(
    matchId: string,
): Promise<void> {

    await updateDoc(

        matchDocument(matchId),

        {

            status: "NOT_PLANNED",

            plannedReservationId: null,

        },

    );

}

export async function validateMatch(
    matchId: string,
): Promise<void> {

    await updateDoc(

        matchDocument(matchId),

        {

            status: "PLANNED",

        },

    );

}