import {
    Alert,
    Button,
    Snackbar,
} from "@mui/material";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useRegisterSW,
} from "virtual:pwa-register/react";

interface RemoteVersion {

    version: string;

}

const UPDATE_CHECK_INTERVAL =
    30 * 60 * 1000;

export function PwaUpdatePrompt() {

    const [
        updateAvailable,
        setUpdateAvailable,
    ] =
        useState(false);

    const [
        updating,
        setUpdating,
    ] =
        useState(false);

    const {
        updateServiceWorker,
    } =
        useRegisterSW({

            immediate:
                true,

            onRegisteredSW(
                swUrl,
                registration,
            ) {

                console.info(
                    "PWA_SW_REGISTERED",
                    swUrl,
                    registration,
                );

            },

            onRegisterError(
                error,
            ) {

                console.error(
                    "PWA_SW_REGISTER_ERROR",
                    error,
                );

            },

        });

    /*
     * ============================================================
     * VERIFICATION DE VERSION
     * ============================================================
     */

    const checkVersion =
        useCallback(
            async () => {

                try {

                    const response =
                        await fetch(
                            `/version.json?t=${Date.now()}`,
                            {
                                cache:
                                    "no-store",
                            },
                        );

                    if (!response.ok) {

                        throw new Error(
                            `VERSION_CHECK_HTTP_${response.status}`,
                        );

                    }

                    const remote =
                        await response.json() as
                        RemoteVersion;

                    console.info(
                        "PWA_VERSION_CHECK",
                        {
                            local:
                                __APP_VERSION__,

                            remote:
                                remote.version,
                        },
                    );

                    if (
                        remote.version
                        !==
                        __APP_VERSION__
                    ) {

                        console.info(
                            "PWA_UPDATE_AVAILABLE",
                            {
                                local:
                                    __APP_VERSION__,

                                remote:
                                    remote.version,
                            },
                        );

                        setUpdateAvailable(
                            true,
                        );

                    }

                }
                catch (error) {

                    /*
                     * Une erreur de vérification de version
                     * ne doit jamais empêcher l'utilisation
                     * de l'application.
                     */

                    console.error(
                        "PWA_VERSION_CHECK_FAILED",
                        error,
                    );

                }

            },
            [],
        );

    /*
     * ============================================================
     * VERIFICATION AU DEMARRAGE
     * ============================================================
     */

    useEffect(() => {

        void checkVersion();

    }, [
        checkVersion,
    ]);

    /*
     * ============================================================
     * VERIFICATION PERIODIQUE
     * ============================================================
     */

    useEffect(() => {

        const interval =
            window.setInterval(
                () => {

                    void checkVersion();

                },
                UPDATE_CHECK_INTERVAL,
            );

        return () => {

            window.clearInterval(
                interval,
            );

        };

    }, [
        checkVersion,
    ]);

    /*
     * ============================================================
     * RETOUR AU PREMIER PLAN
     * ============================================================
     */

    useEffect(() => {

        function handleVisibilityChange() {

            if (
                document.visibilityState
                !==
                "visible"
            ) {

                return;

            }

            void checkVersion();

        }

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange,
        );

        return () => {

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );

        };

    }, [
        checkVersion,
    ]);

    /*
     * ============================================================
     * APPLICATION DE LA MISE A JOUR
     * ============================================================
     */

    async function handleUpdate() {

        try {

            setUpdating(
                true,
            );

            console.info(
                "PWA_UPDATE_REQUESTED",
            );

            /*
             * Demande au nouveau Service Worker
             * de prendre la main s'il est déjà prêt.
             */

            await updateServiceWorker(
                true,
            );

            /*
             * Sécurité :
             *
             * si Android n'avait pas encore placé
             * le nouveau SW en waiting, le reload
             * force le chargement des nouveaux assets.
             */

            window.location.reload();

        }
        catch (error) {

            console.error(
                "PWA_UPDATE_FAILED",
                error,
            );

            setUpdating(
                false,
            );

        }

    }

    return (

        <Snackbar
            open={
                updateAvailable
            }
            anchorOrigin={{
                vertical:
                    "bottom",

                horizontal:
                    "center",
            }}
        >

            <Alert
                severity="info"
                variant="filled"
                action={

                    <Button
                        color="inherit"
                        size="small"
                        disabled={
                            updating
                        }
                        onClick={() => {

                            void handleUpdate();

                        }}
                    >

                        {
                            updating
                                ? "Mise à jour..."
                                : "Mettre à jour"
                        }

                    </Button>

                }
                sx={{
                    width:
                        "100%",
                }}
            >

                Une nouvelle version de DartsLive Bookin est disponible.

            </Alert>

        </Snackbar>

    );

}

export default PwaUpdatePrompt;