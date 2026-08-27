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

    const { user } = useAuth();

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

            if (!user) {

                setLoading(false);

                return;

            }

            const result =
                await getRegistrationsByPlayer(
                    user.uid,
                );

            setRegistrations(result);

            setLoading(false);

        }

        load();

    }, [user]);

    return {

        registrations,

        loading,

    };

}   