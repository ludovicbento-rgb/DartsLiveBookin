import type {
    ReactNode,
} from "react";

import {
    Navigate,
    useLocation,
} from "react-router-dom";

import {
    CircularProgress,
    Stack,
} from "@mui/material";

import {
    useConfiguration,
} from "../hooks/useConfiguration";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

interface Props {

    children:
    ReactNode;

}

export function MaintenanceGuard({

    children,

}: Props) {

    const location =
        useLocation();

    const profile =
        useCurrentUser();

    const {
        configuration,
        loading,
        error,
    } =
        useConfiguration();

    /*
     * ============================================================
     * ROUTES TOUJOURS AUTORISEES
     * ============================================================
     *
     * Ces routes doivent rester accessibles pendant
     * une maintenance.
     *
     * /maintenance :
     * évite une boucle de redirection.
     *
     * /login :
     * permet notamment à un administrateur de se connecter
     * pour désactiver la maintenance.
     *
     * /activate :
     * conserve le parcours d'activation du compte.
     */

    const publicDuringMaintenance =
        location.pathname ===
        "/maintenance"
        ||
        location.pathname ===
        "/login"
        ||
        location.pathname ===
        "/activate"
        ||
        location.pathname ===
        "/install";

    if (
        publicDuringMaintenance
    ) {

        return children;

    }

    /*
     * ============================================================
     * CHARGEMENT CONFIGURATION
     * ============================================================
     */

    if (loading) {

        return (

            <Stack
                sx={{
                    minHeight:
                        "100vh",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",
                }}
            >

                <CircularProgress />

            </Stack>

        );

    }

    /*
     * ============================================================
     * ERREUR CONFIGURATION
     * ============================================================
     *
     * En cas d'erreur de lecture de la configuration,
     * on ne bloque pas toute l'application.
     *
     * Le mode maintenance doit être explicitement actif
     * pour provoquer une redirection.
     */

    if (
        error
        ||
        !configuration
    ) {

        return children;

    }

    /*
     * ============================================================
     * APPLICATION DISPONIBLE
     * ============================================================
     */

    if (
        !configuration
            .maintenanceMode
    ) {

        return children;

    }

    /*
     * ============================================================
     * ADMINISTRATEUR
     * ============================================================
     *
     * L'administrateur conserve toujours l'accès.
     *
     * C'est indispensable afin qu'il puisse accéder à :
     *
     * /administration/maintenance
     *
     * et désactiver le mode maintenance.
     */

    if (
        profile
            ?.roles
            .administrator
    ) {

        return children;

    }

    /*
     * ============================================================
     * MAINTENANCE ACTIVE
     * ============================================================
     *
     * Joueurs, gérants et autres profils sont redirigés
     * vers la page de maintenance.
     */

    return (

        <Navigate
            to="/maintenance"
            replace
        />

    );

}

export default MaintenanceGuard;