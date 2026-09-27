import {
    activateSeason,
    createSeason,
    getSeasons,
    updateSeason,
} from "@/entities/season";

import type {
    Season,
} from "@/entities/season";

import type {
    AdminSeasonRequest,
} from "../model/admin-season.types";

function validateSeason(
    request: AdminSeasonRequest,
): void {

    if (
        request.name.trim() === ""
    ) {

        throw new Error(
            "SEASON_NAME_REQUIRED",
        );

    }

}

export async function loadAdminSeasons():
    Promise<Season[]> {

    const seasons =
        await getSeasons();

    return [...seasons].sort(
        (a, b) =>
            b.name.localeCompare(
                a.name,
                "fr",
            ),
    );

}

export async function createAdminSeason(
    request: AdminSeasonRequest,
): Promise<string> {

    validateSeason(
        request,
    );

    return createSeason(
        request.name.trim(),
    );

}

export async function updateAdminSeason(

    seasonId: string,

    request: AdminSeasonRequest,

): Promise<void> {

    validateSeason(
        request,
    );

    await updateSeason(
        seasonId,
        request.name.trim(),
    );

}

export async function activateAdminSeason(
    seasonId: string,
): Promise<void> {

    await activateSeason(
        seasonId,
    );

}