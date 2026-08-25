import { useState } from "react";

import { createReservationCommand } from "../../commands/createReservation";


import type { ReservationCommand } from "../model/reservation-command";

export function useCreateReservation() {
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    async function create(
        command: ReservationCommand,
    ) {
        setLoading(true);
        setError(null);

        try {
            await createReservationCommand(command);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Une erreur est survenue.");
            }

            throw e;
        } finally {
            setLoading(false);
        }
    }

    return {
        create,
        loading,
        error,
    };
}