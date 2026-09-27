import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";

import AddIcon
    from "@mui/icons-material/Add";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import EmojiEventsIcon
    from "@mui/icons-material/EmojiEvents";

import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    Season,
} from "@/entities/season";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    AdministrationLayout,
} from "@/features/administration/layout/AdministrationLayout";

import {
    AdminSeasonCard,
} from "../components/AdminSeasonCard";

import {
    SeasonFormDrawer,
} from "../components/SeasonFormDrawer";

import {
    useAdminSeasons,
} from "../hooks/useAdminSeasons";

import {
    useSaveAdminSeason,
} from "../hooks/useSaveAdminSeason";

import type {
    AdminSeasonRequest,
} from "../model/admin-season.types";

export function SeasonsPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    const {
        seasons,
        loading,
        error,
        reload,
    } = useAdminSeasons();

    const saveSeason =
        useSaveAdminSeason();

    const [
        drawerOpen,
        setDrawerOpen,
    ] = useState(false);

    const [
        selectedSeason,
        setSelectedSeason,
    ] = useState<Season | null>(
        null,
    );

    const [
        seasonToActivate,
        setSeasonToActivate,
    ] = useState<Season | null>(
        null,
    );

    /*
     * ------------------------------------------------------------
     * Sécurité UI
     * ------------------------------------------------------------
     */

    if (
        !profile
        ||
        !profile.roles.administrator
    ) {

        return (

            <AdministrationLayout>

                <Alert severity="error">

                    Vous n'êtes pas autorisé à gérer les saisons.

                </Alert>

            </AdministrationLayout>

        );

    }

    /*
     * ------------------------------------------------------------
     * Création
     * ------------------------------------------------------------
     */

    function handleCreate() {

        saveSeason.resetError();

        setSelectedSeason(
            null,
        );

        setDrawerOpen(
            true,
        );

    }

    /*
     * ------------------------------------------------------------
     * Modification
     * ------------------------------------------------------------
     */

    function handleEdit(
        season: Season,
    ) {

        saveSeason.resetError();

        setSelectedSeason(
            season,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleCloseDrawer() {

        if (saveSeason.loading) {
            return;
        }

        saveSeason.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedSeason(
            null,
        );

    }

    async function handleSubmit(
        request: AdminSeasonRequest,
    ) {

        if (selectedSeason) {

            await saveSeason.update(

                selectedSeason.id,

                request,

            );

        }
        else {

            await saveSeason.create(
                request,
            );

        }

        setDrawerOpen(
            false,
        );

        setSelectedSeason(
            null,
        );

        await reload();

    }

    /*
     * ------------------------------------------------------------
     * Activation
     * ------------------------------------------------------------
     */

    function handleActivateRequest(
        season: Season,
    ) {

        saveSeason.resetError();

        setSeasonToActivate(
            season,
        );

    }

    function handleCloseActivation() {

        if (saveSeason.loading) {
            return;
        }

        saveSeason.resetError();

        setSeasonToActivate(
            null,
        );

    }

    async function handleConfirmActivation() {

        if (!seasonToActivate) {
            return;
        }

        await saveSeason.activate(
            seasonToActivate.id,
        );

        setSeasonToActivate(
            null,
        );

        await reload();

    }

    return (

        <AdministrationLayout>

            <Stack spacing={3}>

                {/*
                 * ------------------------------------------------
                 * Retour
                 * ------------------------------------------------
                 */}

                <Button
                    variant="text"
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={() =>
                        navigate(
                            "/administration",
                        )
                    }
                    sx={{
                        alignSelf:
                            "flex-start",
                    }}
                >

                    Retour à l'administration

                </Button>

                {/*
                 * ------------------------------------------------
                 * Header
                 * ------------------------------------------------
                 */}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                    sx={{
                        justifyContent:
                            "space-between",

                        alignItems: {
                            xs: "stretch",
                            sm: "center",
                        },
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            alignItems:
                                "center",
                        }}
                    >

                        <EmojiEventsIcon
                            color="primary"
                        />

                        <Stack>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >

                                Saisons

                            </Typography>

                            <Typography
                                color="text.secondary"
                            >

                                Gestion des saisons de championnat

                            </Typography>

                        </Stack>

                    </Stack>

                    <Button
                        variant="contained"
                        startIcon={
                            <AddIcon />
                        }
                        onClick={
                            handleCreate
                        }
                    >

                        Nouvelle saison

                    </Button>

                </Stack>

                {/*
                 * ------------------------------------------------
                 * Erreur
                 * ------------------------------------------------
                 */}

                {
                    error && (

                        <Alert severity="error">

                            Impossible de charger les saisons.

                        </Alert>

                    )
                }

                {
                    saveSeason.error
                    &&
                    !drawerOpen
                    &&
                    !seasonToActivate
                    && (

                        <Alert severity="error">

                            Impossible d'effectuer l'opération.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * Chargement
                 * ------------------------------------------------
                 */}

                {
                    loading && (

                        <Stack
                            spacing={2}
                            sx={{
                                alignItems:
                                    "center",

                                py: 4,
                            }}
                        >

                            <CircularProgress />

                            <Typography
                                color="text.secondary"
                            >

                                Chargement des saisons...

                            </Typography>

                        </Stack>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * Liste vide
                 * ------------------------------------------------
                 */}

                {
                    !loading
                    &&
                    !error
                    &&
                    seasons.length === 0
                    && (

                        <Alert severity="info">

                            Aucune saison n'est encore configurée.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * Liste
                 * ------------------------------------------------
                 */}

                {
                    !loading
                    &&
                    !error
                    &&
                    seasons.length > 0
                    && (

                        <Stack spacing={2}>

                            {
                                seasons.map(
                                    season => (

                                        <AdminSeasonCard

                                            key={
                                                season.id
                                            }

                                            season={
                                                season
                                            }

                                            loading={
                                                saveSeason.loading
                                            }

                                            onEdit={
                                                handleEdit
                                            }

                                            onActivate={
                                                handleActivateRequest
                                            }

                                        />

                                    ),
                                )
                            }

                        </Stack>

                    )
                }

            </Stack>

            {/*
             * ====================================================
             * Création / modification
             * ====================================================
             */}

            <SeasonFormDrawer

                open={
                    drawerOpen
                }

                season={
                    selectedSeason
                }

                loading={
                    saveSeason.loading
                }

                error={
                    saveSeason.error
                }

                onClose={
                    handleCloseDrawer
                }

                onSubmit={
                    handleSubmit
                }

            />

            {/*
             * ====================================================
             * Confirmation d'activation
             * ====================================================
             */}

            <Dialog
                open={
                    seasonToActivate !== null
                }
                onClose={
                    saveSeason.loading
                        ? undefined
                        : handleCloseActivation
                }
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>

                    Définir la saison active

                </DialogTitle>

                <DialogContent>

                    <Stack
                        spacing={2}
                        sx={{
                            pt: 1,
                        }}
                    >

                        <Typography>

                            Voulez-vous définir

                            {" "}

                            <strong>

                                {
                                    seasonToActivate?.name
                                }

                            </strong>

                            {" "}

                            comme saison active ?

                        </Typography>

                        <Alert severity="warning">

                            La saison actuellement active sera automatiquement désactivée.

                        </Alert>

                        {
                            saveSeason.error && (

                                <Alert severity="error">

                                    Impossible d'activer cette saison.

                                </Alert>

                            )
                        }

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button
                        disabled={
                            saveSeason.loading
                        }
                        onClick={
                            handleCloseActivation
                        }
                    >

                        Annuler

                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        disabled={
                            saveSeason.loading
                        }
                        onClick={() => {

                            void handleConfirmActivation();

                        }}
                    >

                        {
                            saveSeason.loading
                                ? "Activation..."
                                : "Activer"
                        }

                    </Button>

                </DialogActions>

            </Dialog>

        </AdministrationLayout>

    );

}

export default SeasonsPage;