import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import {
    useNavigate,
} from "react-router-dom";

import {
    HOME_ROUTE,
    MY_MATCHES_ROUTE,
    VENUE_SETTINGS_ROUTE,
} from "@/shared/routing";

import SportsScoreIcon
    from "@mui/icons-material/SportsScore";

import StorefrontIcon
    from "@mui/icons-material/Storefront";

import AssignmentTurnedInIcon
    from "@mui/icons-material/AssignmentTurnedIn";

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

import AdminPanelSettingsIcon
    from "@mui/icons-material/AdminPanelSettings";

import {
    DashboardActionCard,
} from "@/widgets/dashboard/DashboardActionCard";

import {
    DashboardHeader,
} from "@/widgets/dashboard/DashboardHeader";

import {
    AppLayout,
} from "@/app/layouts/AppLayout";

import {
    AppCard,
} from "@/shared/ui";

import {
    useDashboard,
} from "../hooks/useDashboard";

import {
    useAuth,
} from "@/features/authentication/hooks/useAuth";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    usePendingReservations,
} from "@/features/reservation-validation/hooks/usePendingReservations";

export function DashboardPage() {

    /*
     * ------------------------------------------------------------
     * Navigation
     * ------------------------------------------------------------
     */

    const navigate =
        useNavigate();

    /*
     * ------------------------------------------------------------
     * Utilisateur connecté
     * ------------------------------------------------------------
     */

    const profile =
        useCurrentUser();

    const {
        logout,
    } = useAuth();

    /*
     * ------------------------------------------------------------
     * Dashboard
     * ------------------------------------------------------------
     *
     * Pour un gérant, on transmet son ID métier afin de charger
     * uniquement les établissements qu'il gère.
     */

    const {
        dashboard,
        loading,
        error,
    } = useDashboard(

        profile?.roles.manager
            ? profile.id
            : undefined,

    );

    /*
     * ------------------------------------------------------------
     * Demandes de réservation du gérant
     * ------------------------------------------------------------
     *
     * On réutilise volontairement le même hook que l'écran
     * "Réservations à valider".
     *
     * Cela garantit :
     *
     * - le même filtrage par établissement ;
     * - les mêmes Security Rules ;
     * - la même source de vérité ;
     * - la synchronisation temps réel via onSnapshot.
     */

    const {

        reservations:
        pendingReservations,

        loading:
        pendingReservationsLoading,

        error:
        pendingReservationsError,

    } = usePendingReservations(

        profile?.roles.manager
            ? profile.id
            : "",

    );

    /*
     * ------------------------------------------------------------
     * Guards
     * ------------------------------------------------------------
     */

    if (loading) {

        return (

            <AppLayout>

                <AppCard>

                    Chargement...

                </AppCard>

            </AppLayout>

        );

    }

    if (error) {

        return (

            <AppLayout>

                <AppCard>

                    <Alert severity="error">

                        {error}

                    </Alert>

                </AppCard>

            </AppLayout>

        );

    }

    if (
        !dashboard
        ||
        !profile
    ) {

        return (

            <AppLayout>

                <AppCard>

                    Chargement...

                </AppCard>

            </AppLayout>

        );

    }

    /*
     * ------------------------------------------------------------
     * Valeurs calculées
     * ------------------------------------------------------------
     */

    const userRole =
        profile.roles?.administrator
            ? "Administrateur"
            : profile.roles?.manager
                ? "Gérant"
                : "Joueur";

    /*
     * Nombre de demandes réellement visibles
     * par ce gérant.
     */
    const pendingReservationCount =
        pendingReservations.length;

    /*
     * Première version :
     *
     * l'écran "Mon établissement" travaille actuellement
     * sur un établissement.
     *
     * DashboardData reste néanmoins compatible avec
     * plusieurs établissements.
     */
    const managedVenue =
        dashboard.managedVenues[0];

    /*
     * ------------------------------------------------------------
     * Description de la carte Demandes
     * ------------------------------------------------------------
     */

    const pendingReservationDescription =
        pendingReservationsLoading
            ? "Chargement des demandes..."
            : pendingReservationsError
                ? "Impossible de charger les demandes"
                : pendingReservationCount === 0
                    ? "Aucune réservation à valider"
                    : pendingReservationCount === 1
                        ? "1 réservation à valider"
                        : `${pendingReservationCount} réservations à valider`;

    /*
     * ------------------------------------------------------------
     * Description établissement
     * ------------------------------------------------------------
     */

    const managedVenueDescription =
        managedVenue
            ? (
                `${managedVenue.name} • `
                +
                `${managedVenue.boardCount} cible`
                +
                `${managedVenue.boardCount > 1 ? "s" : ""}`
            )
            : "Aucun établissement associé";

    /*
     * ------------------------------------------------------------
     * Actions
     * ------------------------------------------------------------
     */

    async function handleLogout() {

        await logout();

        navigate(
            HOME_ROUTE,
        );

    }

    /*
     * ------------------------------------------------------------
     * Render
     * ------------------------------------------------------------
     */

    return (

        <AppLayout>

            <Stack
                spacing={2}
                sx={{
                    width:
                        "100%",

                    maxWidth:
                        700,

                    mx:
                        "auto",
                }}
            >

                {/*
                 * ------------------------------------------------
                 * Header
                 * ------------------------------------------------
                 */}

                <DashboardHeader

                    firstname={
                        profile.firstname
                    }

                    role={
                        userRole
                    }

                    season={
                        dashboard.activeSeason?.name
                        ??
                        ""
                    }

                    onLogout={
                        handleLogout
                    }

                />

                {/*
                 * ------------------------------------------------
                 * Actions
                 * ------------------------------------------------
                 */}

                <Stack spacing={2}>

                    {/*
                     * ================================================
                     * JOUEUR
                     * ================================================
                     */}

                    {
                        profile.roles.player && (

                            <DashboardActionCard

                                title="Mes matchs"

                                description="Consulter vos rencontres"

                                icon={
                                    <SportsScoreIcon />
                                }

                                color="primary"

                                onClick={() =>
                                    navigate(
                                        MY_MATCHES_ROUTE,
                                    )
                                }

                            />

                        )
                    }


                    {/*
                     * ================================================
                     * GÉRANT
                     * ================================================
                     *
                     * Demandes à valider
                     */}

                    {
                        profile.roles.manager && (

                            <DashboardActionCard

                                title={
                                    pendingReservationCount > 0
                                        ? `Demandes (${pendingReservationCount})`
                                        : "Demandes"
                                }

                                description={
                                    pendingReservationDescription
                                }

                                icon={
                                    <AssignmentTurnedInIcon />
                                }

                                color="warning"

                                onClick={() =>
                                    navigate(
                                        "/reservation-validation",
                                    )
                                }

                            />

                        )
                    }


                    {/*
                     * ------------------------------------------------
                     * Agenda
                     *
                     * La page Agenda n'est pas encore implémentée.
                     * On conserve l'entrée actuelle sans compteur.
                     * ------------------------------------------------
                     */}

                    {
                        profile.roles.manager && (

                            <DashboardActionCard

                                title="Agenda"

                                description="Consulter les réservations"

                                icon={
                                    <CalendarMonthIcon />
                                }

                                color="success"

                                onClick={() =>
                                    navigate(
                                        "/agenda",
                                    )
                                }

                            />

                        )
                    }


                    {/*
                     * ------------------------------------------------
                     * Établissement du gérant
                     * ------------------------------------------------
                     */}

                    {
                        profile.roles.manager && (

                            <DashboardActionCard

                                title="Mon établissement"

                                description={
                                    managedVenueDescription
                                }

                                icon={
                                    <StorefrontIcon />
                                }

                                color="success"

                                onClick={() =>
                                    navigate(
                                        VENUE_SETTINGS_ROUTE,
                                    )
                                }

                            />

                        )
                    }


                    {/*
                     * ================================================
                     * ADMINISTRATEUR
                     * ================================================
                     */}

                    {
                        profile.roles.administrator && (

                            <DashboardActionCard

                                title="Administration"

                                description="Paramétrage"

                                icon={
                                    <AdminPanelSettingsIcon />
                                }

                                color="primary"

                                onClick={() =>
                                    navigate(
                                        "/admin",
                                    )
                                }

                            />

                        )
                    }

                </Stack>

            </Stack>

        </AppLayout>

    );

}

export default DashboardPage;