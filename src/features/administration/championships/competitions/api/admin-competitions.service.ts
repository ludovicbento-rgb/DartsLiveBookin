import {
    createCompetition,
    getCompetitionsBySeason,
    updateCompetition,
} from "@/entities/competition";

import type {
    Competition,
} from "@/entities/competition";

import type {
    AdminCompetitionRequest,
} from "../model/admin-competition.types";

function validateCompetition(
    request: AdminCompetitionRequest,
): void {

    if (
        request.seasonId.trim() === ""
    ) {

        throw new Error(
            "COMPETITION_SEASON_REQUIRED",
        );

    }

    if (
        request.name.trim() === ""
    ) {

        throw new Error(
            "COMPETITION_NAME_REQUIRED",
        );

    }

    if (
        ![
            "INDIVIDUAL",
            "DOUBLES",
            "TEAM",
        ].includes(
            request.mode,
        )
    ) {

        throw new Error(
            "COMPETITION_MODE_INVALID",
        );

    }

}

export async function loadAdminCompetitions(
    seasonId: string,
): Promise<Competition[]> {

    if (!seasonId) {

        return [];

    }

    const competitions =
        await getCompetitionsBySeason(
            seasonId,
        );

    return [...competitions].sort(
        (a, b) =>
            a.name.localeCompare(
                b.name,
                "fr",
            ),
    );

}

export async function createAdminCompetition(
    request: AdminCompetitionRequest,
): Promise<string> {

    validateCompetition(
        request,
    );

    return createCompetition({

        seasonId:
            request.seasonId,

        name:
            request.name.trim(),

        mode:
            request.mode,

        active:
            request.active,

    });

}

export async function updateAdminCompetition(

    competitionId: string,

    request: AdminCompetitionRequest,

): Promise<void> {

    validateCompetition(
        request,
    );

    await updateCompetition(

        competitionId,

        {

            name:
                request.name.trim(),

            mode:
                request.mode,

            active:
                request.active,

        },

    );

}