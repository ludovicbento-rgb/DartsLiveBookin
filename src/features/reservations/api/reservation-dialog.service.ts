import {
    getRegistrationsByPlayer,
} from "@/entities/registration";

import {
    getRegistrationsByCompetition,
} from "@/entities/registration";

import type {
    Registration,
} from "@/entities/registration";

export interface ReservationDialogData {

    registrations: Registration[];

    opponents: Registration[];

}

export async function loadReservationDialog(

    playerId: string,

    registrationId?: string,

): Promise<ReservationDialogData> {

    const registrations =
        await getRegistrationsByPlayer(
            playerId,
        );

    let opponents: Registration[] = [];

    if (registrationId) {

        const registration =
            registrations.find(

                r =>
                    r.id ===
                    registrationId,

            );

        if (registration) {

            opponents =
                await getRegistrationsByCompetition(

                    registration.competitionId,

                    registration.poolId,

                );

            opponents =
                opponents.filter(

                    opponent =>

                        opponent.id !==
                        registration.id,

                );

        }

    }

    return {

        registrations,

        opponents,

    };

}