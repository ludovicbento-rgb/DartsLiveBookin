import {
    disableMaintenance,
    enableMaintenance,
} from "@/entities/configuration";

export async function activateMaintenance(
    message: string,
    userId: string,
): Promise<void> {

    const normalizedMessage =
        message.trim();

    if (
        normalizedMessage === ""
    ) {

        throw new Error(
            "MAINTENANCE_MESSAGE_REQUIRED",
        );

    }

    await enableMaintenance(
        normalizedMessage,
        userId,
    );

}

export async function deactivateMaintenance():
    Promise<void> {

    await disableMaintenance();

}