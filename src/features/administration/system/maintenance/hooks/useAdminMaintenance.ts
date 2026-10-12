import {
    useState,
} from "react";

import {
    activateMaintenance,
    deactivateMaintenance,
} from "../api/admin-maintenance.service";

export function useAdminMaintenance() {

    const [
        saving,
        setSaving,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );

    const [
        success,
        setSuccess,
    ] =
        useState<string | null>(
            null,
        );

    async function enable(
        message: string,
        userId: string,
    ): Promise<void> {

        try {

            setSaving(true);
            setError(null);
            setSuccess(null);

            await activateMaintenance(
                message,
                userId,
            );

            setSuccess(
                "MAINTENANCE_ENABLED",
            );

        }
        catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "MAINTENANCE_UPDATE_FAILED",
            );

            throw error;

        }
        finally {

            setSaving(false);

        }

    }

    async function disable():
        Promise<void> {

        try {

            setSaving(true);
            setError(null);
            setSuccess(null);

            await deactivateMaintenance();

            setSuccess(
                "MAINTENANCE_DISABLED",
            );

        }
        catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "MAINTENANCE_UPDATE_FAILED",
            );

            throw error;

        }
        finally {

            setSaving(false);

        }

    }

    function clearSuccess() {

        setSuccess(null);

    }

    return {

        saving,

        error,

        success,

        enable,

        disable,

        clearSuccess,

    };

}   