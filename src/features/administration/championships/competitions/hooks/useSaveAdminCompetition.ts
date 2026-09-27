import {
    useState,
} from "react";

import {
    createAdminCompetition,
    updateAdminCompetition,
} from "../api/admin-competitions.service";

import type {
    AdminCompetitionRequest,
} from "../model/admin-competition.types";

export function useSaveAdminCompetition() {

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
        request: AdminCompetitionRequest,
    ): Promise<string> {

        try {

            setLoading(true);
            setError(null);

            return await createAdminCompetition(
                request,
            );

        }
        catch (error) {

            console.error(
                "ADMIN_COMPETITION_CREATE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "COMPETITION_CREATE_FAILED";

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

        competitionId: string,

        request: AdminCompetitionRequest,

    ): Promise<void> {

        try {

            setLoading(true);
            setError(null);

            await updateAdminCompetition(
                competitionId,
                request,
            );

        }
        catch (error) {

            console.error(
                "ADMIN_COMPETITION_UPDATE_FAILED",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "COMPETITION_UPDATE_FAILED";

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