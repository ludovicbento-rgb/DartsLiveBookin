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

import {
    safeCreateAuditLog,
} from "@/entities/audit-log";

import type {
    AuditUser,
} from "@/entities/audit-log";

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
    auditUser: AuditUser,
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

    const createdMatchId =
        await createMatch({

            id:
                matchId,

            matchDayId:
                request.matchDayId,

            homeRegistrationId:
                request.homeRegistrationId,

            awayRegistrationId:
                request.awayRegistrationId,

            playStatus:
                request.playStatus,

        });

    await safeCreateAuditLog({

        action:
            "MATCH_CREATED",

        entityType:
            "MATCH",

        entityId:
            createdMatchId,

        userId:
            auditUser.id,

        userDisplayName:
            auditUser.displayName,

        metadata: {

            matchDayId:
                request.matchDayId,

            homeRegistrationId:
                request.homeRegistrationId,

            homeRegistrationName:
                homeRegistration.registrationName,

            awayRegistrationId:
                request.awayRegistrationId,

            awayRegistrationName:
                awayRegistration.registrationName,

            playStatus:
                request.playStatus,

        },

    });

    return createdMatchId;

}

/*
 * ============================================================
 * MODIFICATION
 * ============================================================
 */

export async function updateAdminMatch(
    matchId: string,
    request: AdminMatchRequest,
    auditUser: AuditUser,
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

        const participantChanges:
            Record<
                string,
                {
                    before: string;
                    after: string;
                }
            > = {};

        /*
         * ============================================================
         * NOMS DES EQUIPES POUR L'AUDIT
         * ============================================================
         */

        const [
            previousHomeRegistration,
            previousAwayRegistration,
            newHomeRegistration,
            newAwayRegistration,
        ] =
            await Promise.all([

                getRegistration(
                    match.homeRegistrationId,
                ),

                getRegistration(
                    match.awayRegistrationId,
                ),

                getRegistration(
                    request.homeRegistrationId,
                ),

                getRegistration(
                    request.awayRegistrationId,
                ),

            ]);

        if (
            match.homeRegistrationId !==
            request.homeRegistrationId
        ) {

            participantChanges.homeRegistrationName = {

                before:
                    previousHomeRegistration
                        ?.registrationName
                    ??
                    match.homeRegistrationId,

                after:
                    newHomeRegistration
                        ?.registrationName
                    ??
                    request.homeRegistrationId,

            };

        }

        if (
            match.awayRegistrationId !==
            request.awayRegistrationId
        ) {

            participantChanges.awayRegistrationName = {

                before:
                    previousAwayRegistration
                        ?.registrationName
                    ??
                    match.awayRegistrationId,

                after:
                    newAwayRegistration
                        ?.registrationName
                    ??
                    request.awayRegistrationId,

            };

        }

        await safeCreateAuditLog({

            action:
                "MATCH_UPDATED",

            entityType:
                "MATCH",

            entityId:
                matchId,

            userId:
                auditUser.id,

            userDisplayName:
                auditUser.displayName,

            metadata: {

                changes:
                    participantChanges,

            },

        });
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

        await safeCreateAuditLog({

            action:
                "MATCH_PLAY_STATUS_CHANGED",

            entityType:
                "MATCH",

            entityId:
                matchId,

            userId:
                auditUser.id,

            userDisplayName:
                auditUser.displayName,

            metadata: {

                changes: {

                    playStatus: {

                        before:
                            currentPlayStatus,

                        after:
                            request.playStatus,

                    },

                },

            },

        });

    }

}   