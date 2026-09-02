import { useEffect, useMemo, useState } from "react";

import {
    getOpponentRegistrations,
    getRegistrationsByPlayer,
    type Registration,
} from "@/entities/registration";

import { useAuth } from "@/features/authentication/hooks/useAuth";

export function useReservationMeeting() {

    const { userProfile,
    } = useAuth();

    const [
        registrations,
        setRegistrations,
    ] = useState<Registration[]>([]);

    const [
        registrationId,
        setRegistrationId,
    ] = useState("");

    const [
        opponents,
        setOpponents,
    ] = useState<Registration[]>([]);

    const [
        opponentRegistrationId,
        setOpponentRegistrationId,
    ] = useState("");

    const [
        notes,
        setNotes,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(true);

    useEffect(() => {

        async function load() {

            if (!userProfile) {

                setLoading(false);

                return;

            }

            const result =
                await getRegistrationsByPlayer(
                    userProfile.playerId,
                );

            setRegistrations(result);

            if (result.length === 1) {

                setRegistrationId(
                    result[0].id,
                );

            }

            setLoading(false);

        }

        load();

    }, [userProfile]);

    useEffect(() => {

        async function loadOpponents() {

            if (!registrationId) {

                setOpponents([]);

                return;

            }

            const result =
                await getOpponentRegistrations(
                    registrationId,
                );

            setOpponents(result);

        }

        loadOpponents();

    }, [registrationId]);

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