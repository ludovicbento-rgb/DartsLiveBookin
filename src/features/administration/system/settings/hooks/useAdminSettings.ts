import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    UpdateConfigurationRequest,
} from "@/entities/configuration";

import type {
    AdminSettingsContext,
} from "../api/admin-settings.service";

import {
    loadAdminSettings,
    saveAdminSettings,
} from "../api/admin-settings.service";

export function useAdminSettings() {

    const [
        context,
        setContext,
    ] =
        useState<AdminSettingsContext | null>(
            null,
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        saving,
        setSaving,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );

    const [
        saved,
        setSaved,
    ] =
        useState(false);

    const reload =
        useCallback(
            async () => {

                try {

                    setLoading(
                        true,
                    );

                    setError(
                        null,
                    );

                    const result =
                        await loadAdminSettings();

                    setContext(
                        result,
                    );

                }
                catch (error) {

                    console.error(
                        "ADMIN_SETTINGS_LOAD_FAILED",
                        error,
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "ADMIN_SETTINGS_LOAD_FAILED",
                    );

                }
                finally {

                    setLoading(
                        false,
                    );

                }

            },
            [],
        );

    useEffect(() => {

        void reload();

    }, [
        reload,
    ]);

    async function save(
        request:
            UpdateConfigurationRequest,
    ): Promise<void> {

        try {

            setSaving(
                true,
            );

            setSaved(
                false,
            );

            setError(
                null,
            );

            await saveAdminSettings(
                request,
            );

            /*
             * On recharge Firestore après
             * l'enregistrement.
             */
            const result =
                await loadAdminSettings();

            setContext(
                result,
            );

            setSaved(
                true,
            );

        }
        catch (error) {

            console.error(
                "ADMIN_SETTINGS_SAVE_FAILED",
                error,
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "ADMIN_SETTINGS_SAVE_FAILED",
            );

            throw error;

        }
        finally {

            setSaving(
                false,
            );

        }

    }

    function clearSaved() {

        setSaved(
            false,
        );

    }

    return {

        context,

        loading,

        saving,

        error,

        saved,

        reload,

        save,

        clearSaved,

    };

}