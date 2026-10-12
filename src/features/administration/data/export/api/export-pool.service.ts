import type {
    Timestamp,
} from "firebase/firestore";

import type {
    Competition,
} from "@/entities/competition";

import type {
    Pool,
} from "@/entities/pool";

import {
    getAllRegistrationsByCompetition,
} from "@/entities/registration";

import {
    getAllMatchDays,
} from "@/entities/matchday";

import {
    getMatchesByMatchDay,
} from "@/entities/match";

import type {
    SeasonImportV2PoolFile,
} from "../../import/model/season-import-v2.types";

/*
 * ============================================================
 * DATE FIRESTORE -> YYYY-MM-DD
 * ============================================================
 */

function timestampToDate(
    timestamp: Timestamp,
): string {

    const date =
        timestamp.toDate();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1,
        ).padStart(
            2,
            "0",
        );

    const day =
        String(
            date.getDate(),
        ).padStart(
            2,
            "0",
        );

    return `${year}-${month}-${day}`;

}

/*
 * ============================================================
 * EXPORT D'UNE POULE
 * ============================================================
 */

export async function buildPoolExport(
    seasonId: string,
    competition: Competition,
    pool: Pool,
): Promise<SeasonImportV2PoolFile> {

    /*
     * ========================================================
     * INSCRIPTIONS
     * ========================================================
     */

    const registrations =
        await getAllRegistrationsByCompetition(

            competition.id,

            pool.id,

        );

    /*
     * ========================================================
     * JOURNEES
     * ========================================================
     */

    const matchDays =
        await getAllMatchDays(

            competition.id,

            pool.id,

        );

    /*
     * ========================================================
     * MATCHS
     * ========================================================
     */

    const matchGroups =
        await Promise.all(

            matchDays.map(
                matchDay =>
                    getMatchesByMatchDay(
                        matchDay.id,
                    ),
            ),

        );

    const matches =
        matchGroups.flat();

    /*
     * ========================================================
     * RESULTAT V2
     * ========================================================
     */

    return {

        schemaVersion:
            2,

        scope:
            "POOL",

        seasonId,

        competitionId:
            competition.id,

        competitionType:
            competition.type,

        pool: {

            id:
                pool.id,

            name:
                pool.name,

            order:
                pool.order,

            active:
                pool.active,

        },

        registrations:
            registrations.map(
                registration => ({

                    id:
                        registration.id,

                    registrationName:
                        registration.registrationName,

                    captainId:
                        registration.captainId,

                    playerIds:
                        registration.playerIds,

                    homeVenueId:
                        registration.homeVenueId,

                    active:
                        registration.active,

                }),
            ),

        matchDays:
            matchDays.map(
                matchDay => ({

                    id:
                        matchDay.id,

                    number:
                        matchDay.number,

                    displayName:
                        matchDay.displayName
                        ||
                        `Journée ${matchDay.number}`,

                    officialDate:
                        timestampToDate(
                            matchDay.officialDate,
                        ),

                    active:
                        matchDay.active,

                }),
            ),

        matches:
            matches.map(
                match => ({

                    id:
                        match.id,

                    matchDayId:
                        match.matchDayId,

                    homeRegistrationId:
                        match.homeRegistrationId,

                    awayRegistrationId:
                        match.awayRegistrationId,

                    /*
                     * L'état sportif est exporté.
                     *
                     * Un ancien document sans playStatus
                     * est considéré comme TO_PLAY.
                     */
                    playStatus:
                        match.playStatus
                        ??
                        "TO_PLAY",

                }),
            ),

    };

}