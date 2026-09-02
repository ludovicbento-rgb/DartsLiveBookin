import {
    useState,
} from "react";

import {
    createVenueScheduleCommand,
} from "@/features/commands/createVenueSchedule";

import {
    updateVenueScheduleCommand,
} from "@/features/commands/updateVenueSchedule";

import {
    deleteVenueScheduleCommand,
} from "@/features/commands/deleteVenueSchedule";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

export function useVenueScheduleEditor() {

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
        schedule: Omit<
            VenueSchedule,
            "id"
        >,
    ) {

        setLoading(true);

        setError(null);

        try {

            await createVenueScheduleCommand(
                schedule,
            );

        }
        catch (e) {

            if (
                e instanceof Error
            ) {

                setError(
                    e.message,
                );

            }

            throw e;

        }
        finally {

            setLoading(false);

        }

    }

    async function update(
        schedule: VenueSchedule,
    ) {

        setLoading(true);

        setError(null);

        try {

            await updateVenueScheduleCommand(
                schedule,
            );

        }
        finally {

            setLoading(false);

        }

    }

    async function remove(
        scheduleId: string,
    ) {

        setLoading(true);

        setError(null);

        try {

            await deleteVenueScheduleCommand(
                scheduleId,
            );

        }
        finally {

            setLoading(false);

        }

    }

    return {

        loading,

        error,

        create,

        update,

        remove,

    };

}