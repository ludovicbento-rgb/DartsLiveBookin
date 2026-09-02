import {
    useEffect,
    useState,
} from "react";

import {
    getRegistrationsByPlayer,
    type Registration,
} from "@/entities/registration";

import { useAuth } from "@/features/authentication/hooks/useAuth";

export function useRegistrations() {

    const {
        userProfile,
    } = useAuth();

    const [
        registrations,
        setRegistrations,
    ] = useState<Registration[]>([]);

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

            setLoading(false);

        }

        load();

    }, [userProfile]);

    return {

        registrations,

        loading,

    };

}   