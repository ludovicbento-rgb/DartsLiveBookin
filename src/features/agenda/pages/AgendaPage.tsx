import {
    Alert,
    CircularProgress,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

import {
    AppLayout,
} from "@/app/layouts/AppLayout";

import {
    AppCard,
    PageTitle,
} from "@/shared/ui";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import Chip from "@mui/material/Chip";

import {
    useManagerAgenda,
} from "../hooks/useManagerAgenda";

import {
    groupAgendaItems,
} from "../model/group-agenda-items";

import {
    AgendaReservationCard,
} from "../components/AgendaReservationCard";

export function AgendaPage() {

    const profile =
        useCurrentUser();

    const {

        items,

        loading,

        error,

    } = useManagerAgenda(

        profile?.roles.manager
            ? profile.id
            : undefined,

    );

    /*
     * ------------------------------------------------------------
     * Chargement
     * ------------------------------------------------------------
     */

    if (loading) {

        return (

            <AppLayout>

                <AppCard>

                    <Stack
                        spacing={2}
                        sx={{
                            alignItems:
                                "center",
                        }}
                    >

                        <CircularProgress />

                        <Typography>

                            Chargement de l'agenda...

                        </Typography>

                    </Stack>

                </AppCard>

            </AppLayout>

        );

    }

    /*
     * ------------------------------------------------------------
     * Erreur
     * ------------------------------------------------------------
     */

    if (error) {

        return (

            <AppLayout>

                <AppCard>

                    <Alert severity="error">

                        Impossible de charger l'agenda.

                    </Alert>

                </AppCard>

            </AppLayout>

        );

    }

    /*
     * ------------------------------------------------------------
     * Accès
     * ------------------------------------------------------------
     */

    if (
        !profile
        ||
        !profile.roles.manager
    ) {

        return (

            <AppLayout>

                <AppCard>

                    <Alert severity="warning">

                        Cet écran est réservé aux gérants.

                    </Alert>

                </AppCard>

            </AppLayout>

        );

    }

    const groups =
        groupAgendaItems(
            items,
        );

    return (

        <AppLayout>

            <Stack
                spacing={3}
                sx={{
                    width:
                        "100%",

                    maxWidth:
                        800,

                    mx:
                        "auto",
                }}
            >

                {/*
                 * ------------------------------------------------
                 * Header
                 * ------------------------------------------------
                 */}

                <Stack spacing={1}>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems:
                                "center",
                        }}
                    >

                        <CalendarMonthIcon
                            color="primary"
                        />

                        <PageTitle>

                            Agenda

                        </PageTitle>

                    </Stack>

                    <Typography
                        color="text.secondary"
                    >

                        Réservations confirmées à venir

                    </Typography>

                </Stack>

                {/*
                 * ------------------------------------------------
                 * Agenda vide
                 * ------------------------------------------------
                 */}

                {
                    groups.length === 0 && (

                        <AppCard>

                            <Stack
                                spacing={1}
                                sx={{
                                    alignItems:
                                        "center",

                                    textAlign:
                                        "center",
                                }}
                            >

                                <CalendarMonthIcon
                                    color="disabled"
                                    sx={{
                                        fontSize:
                                            48,
                                    }}
                                />

                                <Typography
                                    variant="h6"
                                >

                                    Aucune réservation à venir

                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >

                                    Les réservations validées apparaîtront ici automatiquement.

                                </Typography>

                            </Stack>

                        </AppCard>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * Groupes par journée
                 * ------------------------------------------------
                 */}

                {
                    groups.map(
                        group => (

                            <Stack
                                key={
                                    group.key
                                }
                                spacing={2}
                            >

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        alignItems:
                                            "center",
                                    }}
                                >

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight:
                                                700,

                                            textTransform:
                                                "capitalize",
                                        }}
                                    >

                                        {group.label}

                                    </Typography>

                                    <Chip
                                        size="small"
                                        label={
                                            `${group.items.length} réservation${group.items.length > 1
                                                ? "s"
                                                : ""
                                            }`
                                        }
                                    />

                                    <Divider
                                        sx={{
                                            flexGrow:
                                                1,
                                        }}
                                    />

                                </Stack>

                                {
                                    group.items.map(
                                        item => (

                                            <AgendaReservationCard

                                                key={
                                                    item.reservationId
                                                }

                                                item={
                                                    item
                                                }

                                            />

                                        ),
                                    )
                                }

                            </Stack>

                        ),
                    )
                }

            </Stack>

        </AppLayout>

    );

}

export default AgendaPage;