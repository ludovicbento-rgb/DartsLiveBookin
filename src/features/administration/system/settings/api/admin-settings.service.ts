import {
    getConfiguration,
    updateConfiguration,
} from "@/entities/configuration";

import type {
    Configuration,
    UpdateConfigurationRequest,
} from "@/entities/configuration";

import {
    getSeasons,
} from "@/entities/season";

import type {
    Season,
} from "@/entities/season";

export interface AdminSettingsContext {

    configuration:
    Configuration;

    seasons:
    Season[];

}

export async function loadAdminSettings():
    Promise<AdminSettingsContext> {

    const [
        configuration,
        seasons,
    ] =
        await Promise.all([
            getConfiguration(),
            getSeasons(),
        ]);

    return {

        configuration,

        seasons:
            [...seasons].sort(
                (a, b) =>
                    b.name.localeCompare(
                        a.name,
                        "fr",
                    ),
            ),

    };

}

export async function saveAdminSettings(
    request:
        UpdateConfigurationRequest,
): Promise<void> {

    /*
     * ============================================================
     * VALIDATION
     * ============================================================
     */

    if (
        request.applicationName.trim() ===
        ""
    ) {

        throw new Error(
            "SETTINGS_APPLICATION_NAME_REQUIRED",
        );

    }

    if (
        request.currentSeasonId.trim() ===
        ""
    ) {

        throw new Error(
            "SETTINGS_SEASON_REQUIRED",
        );

    }

    if (
        request.version.trim() ===
        ""
    ) {

        throw new Error(
            "SETTINGS_VERSION_REQUIRED",
        );

    }

    await updateConfiguration(
        request,
    );

}