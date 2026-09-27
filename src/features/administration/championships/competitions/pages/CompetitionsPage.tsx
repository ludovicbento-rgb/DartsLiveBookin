import {
    Alert,
    Button,
    CircularProgress,
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
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    Competition,
} from "@/entities/competition";

import {
    getActiveSeason,
} from "@/entities/season";

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
    AdminCompetitionCard,
} from "../components/AdminCompetitionCard";

import {
    CompetitionFormDrawer,
} from "../components/CompetitionFormDrawer";

import {
    useAdminCompetitions,
} from "../hooks/useAdminCompetitions";

import {
    useSaveAdminCompetition,
} from "../hooks/useSaveAdminCompetition";

import type {
    AdminCompetitionRequest,
} from "../model/admin-competition.types";

export function CompetitionsPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    const [
        activeSeason,
        setActiveSeason,
    ] = useState<Season | null>(
        null,
    );

    const [
        seasonLoading,
        setSeasonLoading,
    ] = useState(true);

    const [
        seasonError,
        setSeasonError,
    ] = useState(false);

    useEffect(() => {

        let cancelled =
            false;

        setSeasonLoading(true);
        setSeasonError(false);

        void getActiveSeason()
            .then(season => {

                if (cancelled) {
                    return;
                }

                setActiveSeason(
                    season,
                );

            })
            .catch(error => {

                if (cancelled) {
                    return;
                }

                console.error(
                    "ADMIN_ACTIVE_SEASON_LOAD_FAILED",
                    error,
                );

                setSeasonError(
                    true,
                );

            })
            .finally(() => {

                if (!cancelled) {

                    setSeasonLoading(
                        false,
                    );

                }

            });

        return () => {

            cancelled =
                true;

        };

    }, []);

    const {
        competitions,
        loading,
        error,
        reload,
    } = useAdminCompetitions(
        activeSeason?.id
        ??
        "",
    );

    const saveCompetition =
        useSaveAdminCompetition();

    const [
        drawerOpen,
        setDrawerOpen,
    ] = useState(false);

    const [
        selectedCompetition,
        setSelectedCompetition,
    ] = useState<Competition | null>(
        null,
    );

    if (
        !profile
        ||
        !profile.roles.administrator
    ) {

        return (

            <AdministrationLayout>

                <Alert severity="error">

                    Vous n'êtes pas autorisé à gérer les compétitions.

                </Alert>

            </AdministrationLayout>

        );

    }

    function handleCreate() {

        if (!activeSeason) {
            return;
        }

        saveCompetition.resetError();

        setSelectedCompetition(
            null,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleEdit(
        competition: Competition,
    ) {

        saveCompetition.resetError();

        setSelectedCompetition(
            competition,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleClose() {

        if (saveCompetition.loading) {
            return;
        }

        saveCompetition.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedCompetition(
            null,
        );

    }

    async function handleSubmit(
        request: AdminCompetitionRequest,
    ) {

        if (selectedCompetition) {

            await saveCompetition.update(

                selectedCompetition.id,

                request,

            );

        }
        else {

            await saveCompetition.create(
                request,
            );

        }

        setDrawerOpen(
            false,
        );

        setSelectedCompetition(
            null,
        );

        await reload();

    }

    const pageLoading =
        seasonLoading
        ||
        loading;

    return (

        <AdministrationLayout>

            <Stack spacing={3}>

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

                                Compétitions

                            </Typography>

                            <Typography
                                color="text.secondary"
                            >

                                {
                                    activeSeason
                                        ? activeSeason.name
                                        : "Aucune saison active"
                                }

                            </Typography>

                        </Stack>

                    </Stack>

                    <Button
                        variant="contained"
                        startIcon={
                            <AddIcon />
                        }
                        disabled={
                            !activeSeason
                            ||
                            seasonLoading
                        }
                        onClick={
                            handleCreate
                        }
                    >

                        Nouvelle compétition

                    </Button>

                </Stack>

                {
                    seasonError && (

                        <Alert severity="error">

                            Impossible de charger la saison active.

                        </Alert>

                    )
                }

                {
                    !seasonLoading
                    &&
                    !seasonError
                    &&
                    !activeSeason
                    && (

                        <Alert severity="warning">

                            Aucune saison active n'est configurée.
                            Activez d'abord une saison depuis l'administration.

                        </Alert>

                    )
                }

                {
                    error && (

                        <Alert severity="error">

                            Impossible de charger les compétitions.

                        </Alert>

                    )
                }

                {
                    pageLoading && (

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

                                Chargement des compétitions...

                            </Typography>

                        </Stack>

                    )
                }

                {
                    !pageLoading
                    &&
                    !error
                    &&
                    activeSeason
                    &&
                    competitions.length === 0
                    && (

                        <Alert severity="info">

                            Aucune compétition n'est configurée pour cette saison.

                        </Alert>

                    )
                }

                {
                    !pageLoading
                    &&
                    !error
                    &&
                    competitions.length > 0
                    && (

                        <Stack spacing={2}>

                            {
                                competitions.map(
                                    competition => (

                                        <AdminCompetitionCard

                                            key={
                                                competition.id
                                            }

                                            competition={
                                                competition
                                            }

                                            onEdit={
                                                handleEdit
                                            }

                                        />

                                    ),
                                )
                            }

                        </Stack>

                    )
                }

            </Stack>

            <CompetitionFormDrawer

                open={
                    drawerOpen
                }

                competition={
                    selectedCompetition
                }

                seasonId={
                    activeSeason?.id
                    ??
                    ""
                }

                seasonName={
                    activeSeason?.name
                    ??
                    ""
                }

                loading={
                    saveCompetition.loading
                }

                error={
                    saveCompetition.error
                }

                onClose={
                    handleClose
                }

                onSubmit={
                    handleSubmit
                }

            />

        </AdministrationLayout>

    );

}

export default CompetitionsPage;