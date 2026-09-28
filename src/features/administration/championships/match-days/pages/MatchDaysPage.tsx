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

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

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
    getPoolsByCompetition,
} from "@/entities/pool";

import type {
    MatchDay,
} from "@/entities/matchday";

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
    AdminMatchDayCard,
} from "../components/AdminMatchDayCard";

import {
    MatchDayFormDrawer,
} from "../components/MatchDayFormDrawer";

import {
    useAdminMatchDays,
} from "../hooks/useAdminMatchDays";

import {
    useSaveAdminMatchDay,
} from "../hooks/useSaveAdminMatchDay";

import type {
    AdminMatchDayRequest,
} from "../model/admin-matchday.types";

export function MatchDaysPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    /*
     * ============================================================
     * CONTEXTE CHAMPIONNAT
     * ============================================================
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
        pools,
        setPools,
    ] = useState<Pool[]>(
        [],
    );

    const [
        selectedCompetitionId,
        setSelectedCompetitionId,
    ] = useState("");

    const [
        selectedPoolId,
        setSelectedPoolId,
    ] = useState("");

    const [
        contextLoading,
        setContextLoading,
    ] = useState(true);

    const [
        poolsLoading,
        setPoolsLoading,
    ] = useState(false);

    const [
        contextError,
        setContextError,
    ] = useState(false);

    /*
     * ============================================================
     * SAISON ACTIVE + COMPETITIONS
     * ============================================================
     */

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

                /*
                 * Aucune saison active.
                 */
                if (!season) {

                    setCompetitions([]);
                    setPools([]);

                    setSelectedCompetitionId("");
                    setSelectedPoolId("");

                    return;

                }

                /*
                 * Chargement des compétitions
                 * de la saison active.
                 */
                const result =
                    await getCompetitionsBySeason(
                        season.id,
                    );

                if (cancelled) {
                    return;
                }

                const sortedCompetitions =
                    [...result].sort(
                        (a, b) =>
                            a.name.localeCompare(
                                b.name,
                                "fr",
                            ),
                    );

                setCompetitions(
                    sortedCompetitions,
                );

                /*
                 * On sélectionne en priorité
                 * une compétition active.
                 */
                const defaultCompetition =
                    sortedCompetitions.find(
                        competition =>
                            competition.active,
                    )
                    ??
                    sortedCompetitions[0];

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
                    "ADMIN_MATCHDAYS_CONTEXT_LOAD_FAILED",
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
     * ============================================================
     * POULES DE LA COMPETITION
     * ============================================================
     */

    useEffect(() => {

        let cancelled =
            false;

        async function loadPools() {

            if (!selectedCompetitionId) {

                setPools([]);
                setSelectedPoolId("");

                return;

            }

            try {

                setPoolsLoading(
                    true,
                );

                setContextError(
                    false,
                );

                const result =
                    await getPoolsByCompetition(
                        selectedCompetitionId,
                    );

                if (cancelled) {
                    return;
                }

                const sortedPools =
                    [...result].sort(
                        (a, b) => {

                            const orderDifference =
                                a.order -
                                b.order;

                            if (
                                orderDifference !== 0
                            ) {

                                return orderDifference;

                            }

                            return a.name.localeCompare(
                                b.name,
                                "fr",
                            );

                        },
                    );

                setPools(
                    sortedPools,
                );

                /*
                 * Sélection par défaut :
                 * première poule active,
                 * sinon première poule disponible.
                 */
                const defaultPool =
                    sortedPools.find(
                        pool =>
                            pool.active,
                    )
                    ??
                    sortedPools[0];

                setSelectedPoolId(
                    defaultPool?.id
                    ??
                    "",
                );

            }
            catch (error) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "ADMIN_MATCHDAYS_POOLS_LOAD_FAILED",
                    error,
                );

                setPools([]);
                setSelectedPoolId("");

                setContextError(
                    true,
                );

            }
            finally {

                if (!cancelled) {

                    setPoolsLoading(
                        false,
                    );

                }

            }

        }

        void loadPools();

        return () => {

            cancelled =
                true;

        };

    }, [
        selectedCompetitionId,
    ]);

    /*
     * ============================================================
     * COMPETITION / POULE SELECTIONNEES
     * ============================================================
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

    const selectedPool =
        useMemo(
            () =>
                pools.find(
                    pool =>
                        pool.id ===
                        selectedPoolId,
                )
                ??
                null,
            [
                pools,
                selectedPoolId,
            ],
        );

    /*
     * ============================================================
     * JOURNEES
     * ============================================================
     */

    const {
        matchDays,
        loading:
        matchDaysLoading,
        error:
        matchDaysError,
        reload,
    } = useAdminMatchDays(
        selectedCompetitionId,
        selectedPoolId,
    );

    const saveMatchDay =
        useSaveAdminMatchDay();

    /*
     * ============================================================
     * DRAWER
     * ============================================================
     */

    const [
        drawerOpen,
        setDrawerOpen,
    ] = useState(false);

    const [
        selectedMatchDay,
        setSelectedMatchDay,
    ] = useState<MatchDay | null>(
        null,
    );

    /*
     * ============================================================
     * SECURITE UI
     * ============================================================
     */

    if (
        !profile
        ||
        !profile.roles.administrator
    ) {

        return (

            <AdministrationLayout>

                <Alert severity="error">

                    Vous n'êtes pas autorisé à gérer les journées.

                </Alert>

            </AdministrationLayout>

        );

    }

    /*
     * ============================================================
     * CREATION
     * ============================================================
     */

    function handleCreate() {

        if (
            !selectedCompetition
            ||
            !selectedPool
        ) {

            return;

        }

        saveMatchDay.resetError();

        setSelectedMatchDay(
            null,
        );

        setDrawerOpen(
            true,
        );

    }

    /*
     * ============================================================
     * MODIFICATION
     * ============================================================
     */

    function handleEdit(
        matchDay: MatchDay,
    ) {

        saveMatchDay.resetError();

        setSelectedMatchDay(
            matchDay,
        );

        setDrawerOpen(
            true,
        );

    }

    /*
     * ============================================================
     * FERMETURE DRAWER
     * ============================================================
     */

    function handleCloseDrawer() {

        if (
            saveMatchDay.loading
        ) {

            return;

        }

        saveMatchDay.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedMatchDay(
            null,
        );

    }

    /*
     * ============================================================
     * SAUVEGARDE
     * ============================================================
     */

    async function handleSubmit(
        request: AdminMatchDayRequest,
    ) {

        if (selectedMatchDay) {

            await saveMatchDay.update(

                selectedMatchDay.id,

                request,

            );

        }
        else {

            await saveMatchDay.create(
                request,
            );

        }

        setDrawerOpen(
            false,
        );

        setSelectedMatchDay(
            null,
        );

        await reload();

    }

    /*
     * ============================================================
     * CHANGEMENT COMPETITION
     * ============================================================
     */

    function handleCompetitionChange(
        competitionId: string,
    ) {

        saveMatchDay.resetError();

        /*
         * On ferme le Drawer si le contexte change.
         */
        setDrawerOpen(
            false,
        );

        setSelectedMatchDay(
            null,
        );

        /*
         * La poule précédente n'est plus valide.
         */
        setSelectedPoolId("");

        setSelectedCompetitionId(
            competitionId,
        );

    }

    /*
     * ============================================================
     * CHANGEMENT POULE
     * ============================================================
     */

    function handlePoolChange(
        poolId: string,
    ) {

        saveMatchDay.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedMatchDay(
            null,
        );

        setSelectedPoolId(
            poolId,
        );

    }

    /*
     * ============================================================
     * ETAT DE CHARGEMENT GLOBAL
     * ============================================================
     */

    const pageLoading =
        contextLoading
        ||
        poolsLoading
        ||
        matchDaysLoading;

    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (

        <AdministrationLayout>

            <Stack spacing={3}>

                {/*
                 * ------------------------------------------------
                 * RETOUR
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
                 * HEADER
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

                        <CalendarMonthIcon
                            color="primary"
                        />

                        <Stack>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >

                                Journées

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
                            !selectedPool
                            ||
                            contextLoading
                            ||
                            poolsLoading
                        }
                        onClick={
                            handleCreate
                        }
                    >

                        Nouvelle journée

                    </Button>

                </Stack>

                {/*
                 * ------------------------------------------------
                 * ERREUR CONTEXTE
                 * ------------------------------------------------
                 */}

                {
                    contextError && (

                        <Alert severity="error">

                            Impossible de charger le contexte du championnat.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * AUCUNE SAISON
                 * ------------------------------------------------
                 */}

                {
                    !contextLoading
                    &&
                    !contextError
                    &&
                    !activeSeason
                    && (

                        <Alert severity="warning">

                            Aucune saison active n'est configurée.
                            Activez d'abord une saison depuis l'administration.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * AUCUNE COMPETITION
                 * ------------------------------------------------
                 */}

                {
                    !contextLoading
                    &&
                    activeSeason
                    &&
                    competitions.length === 0
                    && (

                        <Alert severity="warning">

                            Aucune compétition n'est configurée pour cette saison.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * COMPETITION
                 * ------------------------------------------------
                 */}

                {
                    competitions.length > 0 && (

                        <FormControl
                            fullWidth
                        >

                            <InputLabel
                                id="matchday-competition-label"
                            >

                                Compétition

                            </InputLabel>

                            <Select
                                labelId="matchday-competition-label"
                                label="Compétition"
                                value={
                                    selectedCompetitionId
                                }
                                disabled={
                                    contextLoading
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

                {/*
                 * ------------------------------------------------
                 * POULE
                 * ------------------------------------------------
                 */}

                {
                    selectedCompetition
                    &&
                    pools.length > 0
                    && (

                        <FormControl
                            fullWidth
                        >

                            <InputLabel
                                id="matchday-pool-label"
                            >

                                Poule

                            </InputLabel>

                            <Select
                                labelId="matchday-pool-label"
                                label="Poule"
                                value={
                                    selectedPoolId
                                }
                                disabled={
                                    poolsLoading
                                }
                                onChange={
                                    event =>
                                        handlePoolChange(
                                            event.target.value,
                                        )
                                }
                            >

                                {
                                    pools.map(
                                        pool => (

                                            <MenuItem
                                                key={
                                                    pool.id
                                                }
                                                value={
                                                    pool.id
                                                }
                                            >

                                                {pool.name}

                                                {
                                                    !pool.active
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

                {/*
                 * ------------------------------------------------
                 * AUCUNE POULE
                 * ------------------------------------------------
                 */}

                {
                    selectedCompetition
                    &&
                    !poolsLoading
                    &&
                    pools.length === 0
                    && (

                        <Alert severity="info">

                            Cette compétition ne possède aucune poule.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * ERREUR JOURNEES
                 * ------------------------------------------------
                 */}

                {
                    matchDaysError && (

                        <Alert severity="error">

                            Impossible de charger les journées.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * CHARGEMENT
                 * ------------------------------------------------
                 */}

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

                                Chargement des journées...

                            </Typography>

                        </Stack>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * LISTE VIDE
                 * ------------------------------------------------
                 */}

                {
                    !pageLoading
                    &&
                    !matchDaysError
                    &&
                    selectedPool
                    &&
                    matchDays.length === 0
                    && (

                        <Alert severity="info">

                            Aucune journée n'est configurée dans cette poule.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * LISTE
                 * ------------------------------------------------
                 */}

                {
                    !pageLoading
                    &&
                    !matchDaysError
                    &&
                    matchDays.length > 0
                    && (

                        <Stack spacing={2}>

                            {
                                matchDays.map(
                                    matchDay => (

                                        <AdminMatchDayCard

                                            key={
                                                matchDay.id
                                            }

                                            matchDay={
                                                matchDay
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

            {/*
             * ====================================================
             * DRAWER CREATION / MODIFICATION
             * ====================================================
             */}

            <MatchDayFormDrawer

                open={
                    drawerOpen
                }

                matchDay={
                    selectedMatchDay
                }

                seasonId={
                    activeSeason?.id
                    ??
                    ""
                }

                competition={
                    selectedCompetition
                }

                pool={
                    selectedPool
                }

                loading={
                    saveMatchDay.loading
                }

                error={
                    saveMatchDay.error
                }

                onClose={
                    handleCloseDrawer
                }

                onSubmit={
                    handleSubmit
                }

            />

        </AdministrationLayout>

    );

}

export default MatchDaysPage;