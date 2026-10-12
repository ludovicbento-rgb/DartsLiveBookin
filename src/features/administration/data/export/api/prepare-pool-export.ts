import type {
    Competition,
} from "@/entities/competition";

import type {
    Pool,
} from "@/entities/pool";

import type {
    PreparedPoolExport,
} from "../model/pool-export.types";

import {
    buildPoolExport,
} from "./export-pool.service";

export async function preparePoolExport(
    seasonId: string,
    competition: Competition,
    pool: Pool,
): Promise<PreparedPoolExport> {

    const data =
        await buildPoolExport(

            seasonId,

            competition,

            pool,

        );

    const playedMatches =
        data.matches.filter(
            match =>
                match.playStatus ===
                "PLAYED",
        ).length;

    const toPlayMatches =
        data.matches.filter(
            match =>
                match.playStatus ===
                "TO_PLAY",
        ).length;

    return {

        data,

        statistics: {

            registrations:
                data.registrations.length,

            matchDays:
                data.matchDays.length,

            matches:
                data.matches.length,

            playedMatches,

            toPlayMatches,

        },

    };

}