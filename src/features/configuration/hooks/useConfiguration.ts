import {
    useEffect,
    useState,
} from "react";

import {
    getConfiguration,
} from "@/entities/configuration";

import type {
    Configuration,
} from "@/entities/configuration";

export function useConfiguration() {

    const [
        configuration,
        setConfiguration,
    ] = useState<Configuration | null>(
        null,
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState<Error | null>(
        null,
    );

    useEffect(() => {

        let cancelled =
            false;

        async function load() {

            try {

                setLoading(
                    true,
                );

                setError(
                    null,
                );

                const result =
                    await getConfiguration();

                if (!cancelled) {

                    setConfiguration(
                        result,
                    );

                }

            }
            catch (error) {

                if (!cancelled) {

                    setError(
                        error instanceof Error
                            ? error
                            : new Error(
                                "CONFIGURATION_LOAD_FAILED",
                            ),
                    );

                }

            }
            finally {

                if (!cancelled) {

                    setLoading(
                        false,
                    );

                }

            }

        }

        void load();

        return () => {

            cancelled =
                true;

        };

    }, []);

    return {

        configuration,

        loading,

        error,

    };

}