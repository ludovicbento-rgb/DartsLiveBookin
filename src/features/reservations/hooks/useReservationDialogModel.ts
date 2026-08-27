import { useMemo, useState } from "react";

import {
    useRegistrations,
} from "@/features/registrations/hooks/useRegistrations";

import {
    useOpponentRegistrations,
} from "@/features/registrations/hooks/useOpponentRegistrations";

export function useReservationDialogModel() {

    const {

        registrations,

        loading,

    } =
        useRegistrations();

    const [

        registrationId,

        setRegistrationId,

    ] =
        useState<string>("");

    const currentRegistration =
        useMemo(

            () =>

                registrations.find(

                    registration =>

                        registration.id ===
                        registrationId,

                ),

            [

                registrations,

                registrationId,

            ],

        );

    const opponents =
        useOpponentRegistrations(

            currentRegistration?.competitionId,

            currentRegistration?.poolId,

            registrationId,

        );

    const [

        opponentRegistrationId,

        setOpponentRegistrationId,

    ] =
        useState("");

    const [

        notes,

        setNotes,

    ] =
        useState("");

    return {

        loading,

        registrations,

        registrationId,

        setRegistrationId,

        currentRegistration,

        opponents,

        opponentRegistrationId,

        setOpponentRegistrationId,

        notes,

        setNotes,

    };

}