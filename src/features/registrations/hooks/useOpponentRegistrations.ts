import {
    useEffect,
    useState,
} from "react";

import {
    getRegistrationsByCompetition,
    type Registration,
} from "@/entities/registration";

export function useOpponentRegistrations(

    competitionId?: string,

    poolId?: string,

    currentRegistrationId?: string,

) {

    const [

        registrations,

        setRegistrations,

    ] =
        useState<Registration[]>([]);

    useEffect(() => {

        async function load() {

            if (
                !competitionId ||
                !poolId
            ) {
                return;
            }

            const result =
                await getRegistrationsByCompetition(

                    competitionId,

                    poolId,

                );

            setRegistrations(

                result.filter(

                    registration =>

                        registration.id !==
                        currentRegistrationId,

                ),

            );

        }

        load();

    }, [

        competitionId,

        poolId,

        currentRegistrationId,

    ]);

    return registrations;

}