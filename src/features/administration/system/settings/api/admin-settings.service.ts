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

import {
    safeCreateAuditLog,
} from "@/entities/audit-log";

export interface SettingsAuditUser {

    id: string;

    displayName: string;

}

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
    currentConfiguration: Configuration,
    request: UpdateConfigurationRequest,
    user: SettingsAuditUser,
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

    /*
     * ============================================================
     * NORMALISATION
     * ============================================================
     */

    const normalizedRequest:
        UpdateConfigurationRequest = {

        applicationName:
            request.applicationName.trim(),

        currentSeasonId:
            request.currentSeasonId,

        version:
            request.version.trim(),

    };

    /*
     * ============================================================
     * DETECTION DES MODIFICATIONS
     * ============================================================
     */

    const changes:
        Record<
            string,
            {
                before:
                string;

                after:
                string;
            }
        > = {};

    if (
        currentConfiguration.applicationName !==
        normalizedRequest.applicationName
    ) {

        changes.applicationName = {

            before:
                currentConfiguration.applicationName,

            after:
                normalizedRequest.applicationName,

        };

    }

    if (
        currentConfiguration.currentSeasonId !==
        normalizedRequest.currentSeasonId
    ) {

        changes.currentSeasonId = {

            before:
                currentConfiguration.currentSeasonId,

            after:
                normalizedRequest.currentSeasonId,

        };

    }

    if (
        currentConfiguration.version !==
        normalizedRequest.version
    ) {

        changes.version = {

            before:
                currentConfiguration.version,

            after:
                normalizedRequest.version,

        };

    }

    /*
     * Aucun changement :
     * aucune écriture Firestore et aucun audit.
     */

    if (
        Object.keys(
            changes,
        ).length ===
        0
    ) {

        return;

    }

    /*
     * ============================================================
     * ACTION METIER
     * ============================================================
     */

    await updateConfiguration(
        normalizedRequest,
    );

    /*
     * ============================================================
     * AUDIT
     * ============================================================
     */

    await safeCreateAuditLog({

        action:
            "SETTINGS_UPDATED",

        entityType:
            "SYSTEM",

        entityId:
            "configuration",

        userId:
            user.id,

        userDisplayName:
            user.displayName,

        metadata: {

            changes,

        },

    });

}