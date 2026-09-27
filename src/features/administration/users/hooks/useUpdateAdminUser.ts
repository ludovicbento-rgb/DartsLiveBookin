import {
    useState,
} from "react";

import {
    setAdminUserStatus,
    updateAdminUser,
} from "../api/admin-users.service";

import type {
    UpdateAdminUserRequest,
} from "../model/admin-user.types";

export function useUpdateAdminUser() {

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    );

    async function update(
        userId: string,
        request: UpdateAdminUserRequest,
        status: "ACTIVE" | "BLOCKED",
    ): Promise<void> {

        try {

            setLoading(true);
            setError(null);

            /*
             * Mise à jour des données métier.
             */
            await updateAdminUser(
                userId,
                request,
            );

            /*
             * Mise à jour du statut.
             */
            await setAdminUserStatus(
                userId,
                status,
            );

        }
        catch (error) {

            console.error(
                "ADMIN_USER_UPDATE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "USER_UPDATE_FAILED";

            setError(
                message,
            );

            throw error;

        }
        finally {

            setLoading(false);

        }

    }

    function resetError() {

        setError(null);

    }

    return {

        update,

        loading,

        error,

        resetError,

    };

}