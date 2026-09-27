import {
    useState,
} from "react";

import {
    createAdminVenue,
    updateAdminVenue,
} from "../api/admin-venues.service";

import type {
    AdminVenueRequest,
} from "../model/admin-venue.types";

export function useSaveAdminVenue() {

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
        request: AdminVenueRequest,
    ): Promise<string> {

        try {

            setLoading(true);
            setError(null);

            return await createAdminVenue(
                request,
            );

        }
        catch (error) {

            console.error(
                "ADMIN_VENUE_CREATE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "VENUE_CREATE_FAILED";

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
        venueId: string,
        request: AdminVenueRequest,
    ): Promise<void> {

        try {

            setLoading(true);
            setError(null);

            await updateAdminVenue(
                venueId,
                request,
            );

        }
        catch (error) {

            console.error(
                "ADMIN_VENUE_UPDATE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "VENUE_UPDATE_FAILED";

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