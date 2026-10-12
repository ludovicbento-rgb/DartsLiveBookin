import {
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import {
    configurationDocument,
} from "./configuration.firestore";

import {
    mapConfiguration,
} from "./configuration.mapper";

import type {
    Configuration,
} from "./configuration.types";

import {
    onSnapshot,
} from "firebase/firestore";

export function subscribeConfiguration(
    onValue: (
        configuration: Configuration,
    ) => void,
    onError?: (
        error: Error,
    ) => void,
): () => void {

    return onSnapshot(

        configurationDocument,

        snapshot => {

            if (!snapshot.exists()) {

                onError?.(
                    new Error(
                        "CONFIGURATION_NOT_FOUND",
                    ),
                );

                return;

            }

            onValue(
                mapConfiguration(
                    snapshot,
                ),
            );

        },

        error => {

            onError?.(
                error,
            );

        },

    );

}

export async function enableMaintenance(
    message: string,
    userId: string,
): Promise<void> {

    await updateDoc(
        configurationDocument,
        {
            maintenanceMode:
                true,

            maintenanceMessage:
                message.trim(),

            maintenanceStartedAt:
                serverTimestamp(),

            maintenanceStartedBy:
                userId,

            updatedAt:
                serverTimestamp(),
        },
    );

}

export async function disableMaintenance():
    Promise<void> {

    await updateDoc(
        configurationDocument,
        {
            maintenanceMode:
                false,

            maintenanceStartedAt:
                null,

            maintenanceStartedBy:
                null,

            updatedAt:
                serverTimestamp(),
        },
    );

}

export async function getConfiguration() {

    const snapshot =
        await getDoc(
            configurationDocument,
        );

    if (!snapshot.exists()) {

        throw new Error(
            "CONFIGURATION_NOT_FOUND",
        );

    }

    return mapConfiguration(
        snapshot,
    );

}

export type UpdateConfigurationRequest =
    Pick<
        Configuration,
        | "applicationName"
        | "currentSeasonId"
        | "version"
    >;

export async function updateConfiguration(
    request: UpdateConfigurationRequest,
): Promise<void> {

    await updateDoc(
        configurationDocument,
        {
            applicationName:
                request.applicationName.trim(),

            currentSeasonId:
                request.currentSeasonId,

            version:
                request.version.trim(),

            updatedAt:
                serverTimestamp(),
        },
    );

}