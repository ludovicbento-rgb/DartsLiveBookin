import {
    useState,
} from "react";

import {
    createAdminUser,
} from "../api/admin-users.service";

import type {
    CreateAdminUserRequest,
} from "../model/admin-user.types";

import {
    safeCreateAuditLog,
} from "@/entities/audit-log";

import type {
    AuditUser,
} from "@/entities/audit-log";

export function useCreateAdminUser() {

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

    async function create(
        request: CreateAdminUserRequest,
        auditUser: AuditUser,
    ): Promise<string> {

        try {

            setLoading(true);
            setError(null);

            const createdUserId =
                await createAdminUser(
                    request,
                );

            await safeCreateAuditLog({

                action:
                    "USER_CREATED",

                entityType:
                    "USER",

                entityId:
                    createdUserId,

                userId:
                    auditUser.id,

                userDisplayName:
                    auditUser.displayName,

                metadata: {

                    firstname:
                        request.firstname.trim(),

                    lastname:
                        request.lastname.trim(),

                    licenseNumber:
                        request.licenseNumber.trim(),

                    roles: {

                        player:
                            request.roles.player,

                        manager:
                            request.roles.manager,

                        administrator:
                            request.roles.administrator,

                    },

                },

            });

            return createdUserId;

        }
        catch (error) {

            console.error(
                "ADMIN_USER_CREATE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "USER_CREATE_FAILED";

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

        create,

        loading,

        error,

        resetError,

    };

}