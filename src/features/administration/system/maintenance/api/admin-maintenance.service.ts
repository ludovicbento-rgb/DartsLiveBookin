import {
    disableMaintenance,
    enableMaintenance,
} from "@/entities/configuration";

import {
    safeCreateAuditLog,
} from "@/entities/audit-log";

export interface MaintenanceAuditUser {

    id: string;

    displayName: string;

}

export async function activateMaintenance(
    message: string,
    user: MaintenanceAuditUser,
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

    /*
     * ============================================================
     * ACTION METIER
     * ============================================================
     */

    await enableMaintenance(
        normalizedMessage,
        user.id,
    );

    /*
     * ============================================================
     * AUDIT
     * ============================================================
     */

    await safeCreateAuditLog({

        action:
            "MAINTENANCE_ENABLED",

        entityType:
            "SYSTEM",

        entityId:
            "configuration",

        userId:
            user.id,

        userDisplayName:
            user.displayName,

        metadata: {

            message:
                normalizedMessage,

        },

    });

}

export async function deactivateMaintenance(
    user: MaintenanceAuditUser,
): Promise<void> {

    /*
     * ============================================================
     * ACTION METIER
     * ============================================================
     */

    await disableMaintenance();

    /*
     * ============================================================
     * AUDIT
     * ============================================================
     */

    await safeCreateAuditLog({

        action:
            "MAINTENANCE_DISABLED",

        entityType:
            "SYSTEM",

        entityId:
            "configuration",

        userId:
            user.id,

        userDisplayName:
            user.displayName,

        metadata:
            {},

    });

}