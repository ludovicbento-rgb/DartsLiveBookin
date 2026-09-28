import {
    Alert,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";

import AddIcon
    from "@mui/icons-material/Add";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import GroupsIcon
    from "@mui/icons-material/Groups";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    Competition,
} from "@/entities/competition";

import {
    getCompetitionsBySeason,
} from "@/entities/competition";

import type {
    Pool,
} from "@/entities/pool";

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
    AdminPoolCard,
} from "../components/AdminPoolCard";

import {
    PoolFormDrawer,
} from "../components/PoolFormDrawer";

import {
    useAdminPools,
} from "../hooks/useAdminPools";

import {
    useSaveAdminPool,
} from "../hooks/useSaveAdminPool";

import type {
    AdminPoolRequest,
} from "../model/admin-pool.types";

export function PoolsPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    /*
     * ------------------------------------------------------------
     * Saison active
     * ------------------------------------------------------------
     */

    const [
        activeSeason,
        setActiveSeason,
    ] = useState<Season | null>(
        null,
    );

    const [
        competitions,
        setCompetitions,
    ] = useState<Competition[]>(
        [],
    );

    const [
        contextLoading,
        setContextLoading,
    ] = useState(true);

    const [
        contextError,
        setContextError,
    ] = useState(false);

    const [
        selectedCompetitionId,
        setSelectedCompetitionId,
    ] = useState("");

    useEffect(() => {

        let cancelled =
            false;

        async function loadContext() {

            try {

                setContextLoading(
                    true,
                );

                setContextError(
                    false,
                );

                const season =
                    await getActiveSeason();

                if (cancelled) {
                    return;
                }

                setActiveSeason(
                    season,
                );

                if (!season) {

                    setCompetitions([]);
                    setSelectedCompetitionId("");

                    return;

                }

                const result =
                    await getCompetitionsBySeason(
                        season.id,
                    );

                if (cancelled) {
                    return;
                }

                const sorted =
                    [...result]
                        .sort(
                            (a, b) =>
                                a.name.localeCompare(
                                    b.name,
                                    "fr",
                                ),
                        );

                setCompetitions(
                    sorted,
                );

                /*
                 * Première compétition active par défaut.
                 * À défaut, première compétition disponible.
                 */
                const defaultCompetition =
                    sorted.find(
                        competition =>
                            competition.active,
                    )
                    ??
                    sorted[0];

                setSelectedCompetitionId(
                    defaultCompetition?.id
                    ??
                    "",
                );

            }
            catch (error) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "ADMIN_POOLS_CONTEXT_LOAD_FAILED",
                    error,
                );

                setContextError(
                    true,
                );

            }
            finally {

                if (!cancelled) {

                    setContextLoading(
                        false,
                    );

                }

            }

        }

        void loadContext();

        return () => {

            cancelled =
                true;

        };

    }, []);

    /*
     * ------------------------------------------------------------
     * Compétition sélectionnée
     * ------------------------------------------------------------
     */

    const selectedCompetition =
        useMemo(
            () =>
                competitions.find(
                    competition =>
                        competition.id ===
                        selectedCompetitionId,
                )
                ??
                null,
            [
                competitions,
                selectedCompetitionId,
            ],
        );

    /*
     * ------------------------------------------------------------
     * Poules
     * ------------------------------------------------------------
     */

    const {
        pools,
        loading,
        error,
        reload,
    } = useAdminPools(
        selectedCompetitionId,
    );

    const savePool =
        useSaveAdminPool();

    const [
        drawerOpen,
        setDrawerOpen,
    ] = useState(false);

    const [
        selectedPool,
        setSelectedPool,
    ] = useState<Pool | null>(
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

                    Vous n'êtes pas autorisé à gérer les poules.

                </Alert>

            </AdministrationLayout>

        );

    }

    /*
     * ------------------------------------------------------------
     * Actions
     * ------------------------------------------------------------
     */

    function handleCreate() {

        if (!selectedCompetition) {
            return;
        }

        savePool.resetError();

        setSelectedPool(
            null,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleEdit(
        pool: Pool,
    ) {

        savePool.resetError();

        setSelectedPool(
            pool,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleClose() {

        if (savePool.loading) {
            return;
        }

        savePool.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedPool(
            null,
        );

    }

    async function handleSubmit(
        request: AdminPoolRequest,
    ) {

        if (selectedPool) {

            await savePool.update(

                selectedPool.id,

                request,

            );

        }
        else {

            await savePool.create(
                request,
            );

        }

        setDrawerOpen(
            false,
        );

        setSelectedPool(
            null,
        );

        await reload();

    }

    /*
     * Si on change de compétition,
     * on ferme un éventuel Drawer.
     */
    function handleCompetitionChange(
        competitionId: string,
    ) {

        savePool.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedPool(
            null,
        );

        setSelectedCompetitionId(
            competitionId,
        );

    }

    const pageLoading =
        contextLoading
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

                        <GroupsIcon
                            color="primary"
                        />

                        <Stack>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >

                                Poules

                            </Typography>

                            <Typography
                                color="text.secondary"
                            >

                                {
                                    activeSeason?.name
                                    ??
                                    "Aucune saison active"
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
                            !selectedCompetition
                            ||
                            contextLoading
                        }
                        onClick={
                            handleCreate
                        }
                    >

                        Nouvelle poule

                    </Button>

                </Stack>

                {
                    contextError && (

                        <Alert severity="error">

                            Impossible de charger la saison ou les compétitions.

                        </Alert>

                    )
                }

                {
                    !contextLoading
                    &&
                    !contextError
                    &&
                    !activeSeason
                    && (

                        <Alert severity="warning">

                            Aucune saison active n'est configurée.

                        </Alert>

                    )
                }

                {
                    !contextLoading
                    &&
                    activeSeason
                    &&
                    competitions.length === 0
                    && (

                        <Alert severity="warning">

                            Aucune compétition n'est configurée pour cette saison.
                            Créez d'abord une compétition.

                        </Alert>

                    )
                }

                {
                    competitions.length > 0 && (

                        <FormControl
                            fullWidth
                        >

                            <InputLabel
                                id="competition-label"
                            >

                                Compétition

                            </InputLabel>

                            <Select
                                labelId="competition-label"
                                label="Compétition"
                                value={
                                    selectedCompetitionId
                                }
                                onChange={
                                    event =>
                                        handleCompetitionChange(
                                            event.target.value,
                                        )
                                }
                            >

                                {
                                    competitions.map(
                                        competition => (

                                            <MenuItem
                                                key={
                                                    competition.id
                                                }
                                                value={
                                                    competition.id
                                                }
                                            >

                                                {competition.name}

                                                {
                                                    !competition.active
                                                        ? " — inactive"
                                                        : ""
                                                }

                                            </MenuItem>

                                        ),
                                    )
                                }

                            </Select>

                        </FormControl>

                    )
                }

                {
                    error && (

                        <Alert severity="error">

                            Impossible de charger les poules.

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

                                Chargement des poules...

                            </Typography>

                        </Stack>

                    )
                }

                {
                    !pageLoading
                    &&
                    !error
                    &&
                    selectedCompetition
                    &&
                    pools.length === 0
                    && (

                        <Alert severity="info">

                            Aucune poule n'est configurée pour cette compétition.

                        </Alert>

                    )
                }

                {
                    !pageLoading
                    &&
                    !error
                    &&
                    pools.length > 0
                    && (

                        <Stack spacing={2}>

                            {
                                pools.map(
                                    pool => (

                                        <AdminPoolCard

                                            key={
                                                pool.id
                                            }

                                            pool={
                                                pool
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

            <PoolFormDrawer

                open={
                    drawerOpen
                }

                pool={
                    selectedPool
                }

                competitionId={
                    selectedCompetition?.id
                    ??
                    ""
                }

                competitionName={
                    selectedCompetition?.name
                    ??
                    ""
                }

                loading={
                    savePool.loading
                }

                error={
                    savePool.error
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

export default PoolsPage;