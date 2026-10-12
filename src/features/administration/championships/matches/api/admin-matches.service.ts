import {
    buildMatchId,
    createMatch,
    getMatch,
    getMatchesByMatchDay,
    updateMatchParticipants,
    updateMatchPlayStatus,
} from "@/entities/match";

import type {
    Match,
} from "@/entities/match";

import {
    getRegistration,
} from "@/entities/registration";

import type {
    AdminMatchRequest,
} from "../model/admin-match.types";

import {
    validateAdminMatch,
} from "./admin-match-validator";

/*
 * ============================================================
 * LECTURE
 * ============================================================
 */

export async function loadAdminMatches(
    matchDayId: string,
): Promise<Match[]> {

    if (!matchDayId) {

        return [];

    }

    return getMatchesByMatchDay(
        matchDayId,
    );

}

/*
 * ============================================================
 * CREATION
 * ============================================================
 */

export async function createAdminMatch(
    request: AdminMatchRequest,
): Promise<string> {

    await validateAdminMatch(
        request,
    );

    const [
        homeRegistration,
        awayRegistration,
    ] =
        await Promise.all([

            getRegistration(
                request.homeRegistrationId,
            ),

            getRegistration(
                request.awayRegistrationId,
            ),

        ]);

    if (
        !homeRegistration
        ||
        !awayRegistration
    ) {

        throw new Error(
            "MATCH_REGISTRATION_NOT_FOUND",
        );

    }

    /*
     * ID déterministe :
     *
     * cf2027-doublettes-p9-j10
     * +
     * poils-au-bull
     * +
     * au-picot-biere
     */
    const matchId =
        buildMatchId(

            request.matchDayId,

            homeRegistration
                .registrationName,

            awayRegistration
                .registrationName,

        );

    return createMatch({

        id:
            matchId,

        matchDayId:
            request.matchDayId,

        homeRegistrationId:
            request.homeRegistrationId,

        awayRegistrationId:
            request.awayRegistrationId,

        /*
         * TO_PLAY ou PLAYED.
         *
         * status reste systématiquement
         * NOT_PLANNED à la création.
         */
        playStatus:
            request.playStatus,

    });

}

/*
 * ============================================================
 * MODIFICATION
 * ============================================================
 */

export async function updateAdminMatch(
    matchId: string,
    request: AdminMatchRequest,
): Promise<void> {

    const match =
        await getMatch(
            matchId,
        );

    if (!match) {

        throw new Error(
            "MATCH_NOT_FOUND",
        );

    }

    /*
     * La journée reste immuable.
     */
    if (
        match.matchDayId !==
        request.matchDayId
    ) {

        throw new Error(
            "MATCHDAY_IMMUTABLE",
        );

    }

    /*
     * ========================================================
     * MODIFICATION DES ADVERSAIRES
     * ========================================================
     *
     * On autorise leur modification uniquement si :
     *
     * - le match n'est pas encore joué ;
     * - il n'est pas réservé.
     */

    const participantsChanged =

        match.homeRegistrationId !==
        request.homeRegistrationId

        ||

        match.awayRegistrationId !==
        request.awayRegistrationId;

    if (
        participantsChanged
    ) {

        if (
            match.playStatus ===
            "PLAYED"
        ) {

            throw new Error(
                "MATCH_ALREADY_PLAYED",
            );

        }

        if (
            match.status !==
            "NOT_PLANNED"
            ||
            match.plannedReservationId !==
            null
        ) {

            throw new Error(
                "MATCH_ALREADY_RESERVED",
            );

        }

        await validateAdminMatch(
            request,
            matchId,
        );

        await updateMatchParticipants(

            matchId,

            {

                homeRegistrationId:
                    request.homeRegistrationId,

                awayRegistrationId:
                    request.awayRegistrationId,

            },

        );

    }

    /*
     * ========================================================
     * MODIFICATION DU STATUT SPORTIF
     * ========================================================
     */

    const currentPlayStatus =
        match.playStatus
        ??
        "TO_PLAY";

    if (
        currentPlayStatus !==
        request.playStatus
    ) {

        /*
         * Un match avec une réservation active
         * ne peut pas être déclaré joué manuellement.
         *
         * On évite :
         *
         * playStatus = PLAYED
         * status     = PENDING / PLANNED
         */
        if (
            request.playStatus ===
            "PLAYED"
            &&
            (
                match.status !==
                "NOT_PLANNED"
                ||
                match.plannedReservationId !==
                null
            )
        ) {

            throw new Error(
                "MATCH_ALREADY_RESERVED",
            );

        }

        /*
         * PLAYED -> TO_PLAY est autorisé pour
         * corriger une erreur Admin, à condition
         * qu'aucune réservation ne soit liée.
         */
        if (
            request.playStatus ===
            "TO_PLAY"
            &&
            match.plannedReservationId !==
            null
        ) {

            throw new Error(
                "MATCH_ALREADY_RESERVED",
            );

        }

        await updateMatchPlayStatus(
            matchId,
            request.playStatus,
        );

    }

}