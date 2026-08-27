import { useEffect, useState } from "react";

import {
    getConfiguration,
    type Configuration,
} from "@/entities/configuration";

export function useConfiguration() {

    const [
        configuration,
        setConfiguration,
    ] = useState<Configuration | null>(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    useEffect(() => {

        async function load() {

            try {

                const config =
                    await getConfiguration();

                setConfiguration(config);

            }
            catch (e) {

                if (e instanceof Error) {

                    setError(e.message);

                }
                else {

                    setError(
                        "Une erreur est survenue.",
                    );

                }

            }
            finally {

                setLoading(false);

            }

        }

        load();

    }, []);

    return {

        configuration,

        loading,

        error,

    };

}