import {
    useState,
} from "react";

import {
    createAdminUser,
} from "../api/admin-users.service";

import type {
    CreateAdminUserRequest,
} from "../model/admin-user.types";

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
    ): Promise<string> {

        try {

            setLoading(true);
            setError(null);

            return await createAdminUser(
                request,
            );

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