import {
    useEffect,
    useState,
} from "react";

import {
    subscribeConfiguration,
} from "@/entities/configuration";

import type {
    Configuration,
} from "@/entities/configuration";

export function useConfiguration() {

    const [
        configuration,
        setConfiguration,
    ] =
        useState<Configuration | null>(
            null,
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        error,
        setError,
    ] =
        useState<Error | null>(
            null,
        );

    useEffect(() => {

        setLoading(
            true,
        );

        setError(
            null,
        );

        const unsubscribe =
            subscribeConfiguration(

                configuration => {

                    setConfiguration(
                        configuration,
                    );

                    setError(
                        null,
                    );

                    setLoading(
                        false,
                    );

                },

                error => {

                    setError(
                        error,
                    );

                    setLoading(
                        false,
                    );

                },

            );

        return unsubscribe;

    }, []);

    return {

        configuration,

        loading,

        error,

    };

}