import {
    useState,
} from "react";

import {
    createAdminRegistration,
    updateAdminRegistration,
} from "../api/admin-registrations.service";

import type {
    AdminRegistrationRequest,
} from "../model/admin-registration.types";

export function useSaveAdminRegistration() {

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
        request: AdminRegistrationRequest,
    ): Promise<string> {

        try {

            setLoading(true);
            setError(null);

            return await createAdminRegistration(
                request,
            );

        }
        catch (error) {

            console.error(
                "ADMIN_REGISTRATION_CREATE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "REGISTRATION_CREATE_FAILED";

            setError(
                message,
            );

            throw error;

        }
        finally {

            setLoading(false);

        }

    }

    async function update(

        registrationId: string,

        request: AdminRegistrationRequest,

    ): Promise<void> {

        try {

            setLoading(true);
            setError(null);

            await updateAdminRegistration(
                registrationId,
                request,
            );

        }
        catch (error) {

            console.error(
                "ADMIN_REGISTRATION_UPDATE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "REGISTRATION_UPDATE_FAILED";

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

        update,

        loading,

        error,

        resetError,

    };

}