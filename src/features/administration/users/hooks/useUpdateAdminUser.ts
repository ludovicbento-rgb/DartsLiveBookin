import {
    useState,
} from "react";

import {
    setAdminUserStatus,
    updateAdminUser,
} from "../api/admin-users.service";

import {
    safeCreateAuditLog,
} from "@/entities/audit-log";

import type {
    AuditUser,
} from "@/entities/audit-log";

import type {
    AdminUserListItem,
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
        currentUser: AdminUserListItem,
        request: UpdateAdminUserRequest,
        status: "ACTIVE" | "BLOCKED",
        auditUser: AuditUser,
    ): Promise<void> {

        try {

            setLoading(true);
            setError(null);

            const changes:
                Record<
                    string,
                    {
                        before: unknown;
                        after: unknown;
                    }
                > = {};

            const firstname =
                request.firstname.trim();

            const lastname =
                request.lastname.trim();

            const email =
                request.email.trim();

            if (
                currentUser.firstname !==
                firstname
            ) {

                changes.firstname = {

                    before:
                        currentUser.firstname,

                    after:
                        firstname,

                };

            }

            if (
                currentUser.lastname !==
                lastname
            ) {

                changes.lastname = {

                    before:
                        currentUser.lastname,

                    after:
                        lastname,

                };

            }

            if (
                currentUser.email !==
                email
            ) {

                changes.email = {

                    before:
                        currentUser.email,

                    after:
                        email,

                };

            }

            if (
                currentUser.roles.player !==
                request.roles.player
            ) {

                changes.rolePlayer = {

                    before:
                        currentUser.roles.player,

                    after:
                        request.roles.player,

                };

            }

            if (
                currentUser.roles.manager !==
                request.roles.manager
            ) {

                changes.roleManager = {

                    before:
                        currentUser.roles.manager,

                    after:
                        request.roles.manager,

                };

            }

            if (
                currentUser.roles.administrator !==
                request.roles.administrator
            ) {

                changes.roleAdministrator = {

                    before:
                        currentUser.roles.administrator,

                    after:
                        request.roles.administrator,

                };

            }

            const statusChanged =
                currentUser.status !==
                status;

            await updateAdminUser(
                currentUser.id,
                request,
            );

            await setAdminUserStatus(
                currentUser.id,
                status,
            );

            if (
                Object.keys(
                    changes,
                ).length > 0
            ) {

                await safeCreateAuditLog({

                    action:
                        "USER_UPDATED",

                    entityType:
                        "USER",

                    entityId:
                        currentUser.id,

                    userId:
                        auditUser.id,

                    userDisplayName:
                        auditUser.displayName,

                    metadata: {

                        targetUserDisplayName:
                            `${firstname} ${lastname}`.trim(),

                        changes,

                    },

                });

            }

            if (
                statusChanged
            ) {

                await safeCreateAuditLog({

                    action:
                        "USER_STATUS_CHANGED",

                    entityType:
                        "USER",

                    entityId:
                        currentUser.id,

                    userId:
                        auditUser.id,

                    userDisplayName:
                        auditUser.displayName,

                    metadata: {

                        targetUserDisplayName:
                            `${firstname} ${lastname}`.trim(),

                        changes: {

                            userStatus: {

                                before:
                                    currentUser.status,

                                after:
                                    status,

                            },

                        },

                    },

                });

            }

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