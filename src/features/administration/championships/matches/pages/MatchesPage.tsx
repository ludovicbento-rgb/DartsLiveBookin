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

import SportsEsportsIcon
    from "@mui/icons-material/SportsEsports";

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
    Match,
} from "@/entities/match";

import type {
    MatchDay,
} from "@/entities/matchday";

import {
    getAllMatchDays,
} from "@/entities/matchday";

import type {
    Pool,
} from "@/entities/pool";

import {
    getPoolsByCompetition,
} from "@/entities/pool";

import type {
    Registration,
} from "@/entities/registration";

import {
    getAllRegistrationsByCompetition,
} from "@/entities/registration";

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
    AdminMatchCard,
} from "../components/AdminMatchCard";

import {
    MatchFormDrawer,
} from "../components/MatchFormDrawer";

import {
    useAdminMatches,
} from "../hooks/useAdminMatches";

import {
    useSaveAdminMatch,
} from "../hooks/useSaveAdminMatch";

import type {
    AdminMatchRequest,
} from "../model/admin-match.types";

export function MatchesPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    /*
     * ============================================================
     * CONTEXTE
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
        matchDays,
        setMatchDays,
    ] = useState<MatchDay[]>(
        [],
    );

    const [
        registrations,
        setRegistrations,
    ] = useState<Registration[]>(
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
        selectedMatchDayId,
        setSelectedMatchDayId,
    ] = useState("");

    const [
        contextLoading,
        setContextLoading,
    ] = useState(true);

    const [
        poolContextLoading,
        setPoolContextLoading,
    ] = useState(false);

    const [
        contextError,
        setContextError,
    ] = useState(false);

    /*
     * ============================================================
     * SAISON + COMPETITIONS
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
                    [...result].sort(
                        (a, b) =>
                            a.name.localeCompare(
                                b.name,
                                "fr",
                            ),
                    );

                setCompetitions(
                    sorted,
                );

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
                    "ADMIN_MATCHES_CONTEXT_LOAD_FAILED",
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
 * POULES DE LA COMPETITION SELECTIONNEE
 * ============================================================
 */

    useEffect(() => {

        let cancelled =
            false;

        async function loadPools() {

            if (!selectedCompetitionId) {

                setPools([]);
                setSelectedPoolId("");
                setMatchDays([]);
                setSelectedMatchDayId("");

                return;

            }

            try {

                setPoolContextLoading(
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
                            pool.active === true,
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
                    "ADMIN_MATCHES_POOLS_LOAD_FAILED",
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

                    setPoolContextLoading(
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
     * JOURNEES + INSCRIPTIONS
     * ============================================================
     */

    useEffect(() => {

        let cancelled =
            false;

        async function loadPoolContext() {

            if (
                !selectedCompetitionId
                ||
                !selectedPoolId
            ) {

                setMatchDays([]);
                setRegistrations([]);
                setSelectedMatchDayId("");

                return;

            }

            try {

                setPoolContextLoading(
                    true,
                );

                setContextError(
                    false,
                );

                const [
                    matchDayResult,
                    registrationResult,
                ] =
                    await Promise.all([

                        getAllMatchDays(
                            selectedCompetitionId,
                            selectedPoolId,
                        ),

                        getAllRegistrationsByCompetition(
                            selectedCompetitionId,
                            selectedPoolId,
                        ),

                    ]);

                if (cancelled) {
                    return;
                }

                const sortedMatchDays =
                    [...matchDayResult].sort(
                        (a, b) =>
                            a.number -
                            b.number,
                    );

                setMatchDays(
                    sortedMatchDays,
                );

                setRegistrations(
                    registrationResult,
                );

                const defaultMatchDay =
                    sortedMatchDays.find(
                        matchDay =>
                            matchDay.active,
                    )
                    ??
                    sortedMatchDays[0];

                setSelectedMatchDayId(
                    defaultMatchDay?.id
                    ??
                    "",
                );

            }
            catch (error) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "ADMIN_MATCHES_POOL_CONTEXT_LOAD_FAILED",
                    error,
                );

                setMatchDays([]);
                setRegistrations([]);
                setSelectedMatchDayId("");

                setContextError(
                    true,
                );

            }
            finally {

                if (!cancelled) {

                    setPoolContextLoading(
                        false,
                    );

                }

            }

        }

        void loadPoolContext();

        return () => {

            cancelled =
                true;

        };

    }, [
        selectedCompetitionId,
        selectedPoolId,
    ]);

    /*
     * ============================================================
     * CONTEXTE SELECTIONNE
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

    const selectedMatchDay =
        useMemo(
            () =>
                matchDays.find(
                    matchDay =>
                        matchDay.id ===
                        selectedMatchDayId,
                )
                ??
                null,
            [
                matchDays,
                selectedMatchDayId,
            ],
        );

    /*
     * ============================================================
     * MATCHS
     * ============================================================
     */

    const {
        matches,
        loading:
        matchesLoading,
        error:
        matchesError,
        reload,
    } = useAdminMatches(
        selectedMatchDayId,
    );

    const saveMatch =
        useSaveAdminMatch();

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
        selectedMatch,
        setSelectedMatch,
    ] = useState<Match | null>(
        null,
    );

    /*
     * ============================================================
     * RESOLUTION DES NOMS
     * ============================================================
     */

    const registrationNamesById =
        useMemo(
            () => {

                const result =
                    new Map<
                        string,
                        string
                    >();

                for (
                    const registration
                    of registrations
                ) {

                    result.set(
                        registration.id,
                        registration.registrationName,
                    );

                }

                return result;

            },
            [
                registrations,
            ],
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

                    Vous n'êtes pas autorisé à gérer les matchs.

                </Alert>

            </AdministrationLayout>

        );

    }

    /*
     * ============================================================
     * ACTIONS
     * ============================================================
     */

    function handleCreate() {

        if (!selectedMatchDay) {
            return;
        }

        saveMatch.resetError();

        setSelectedMatch(
            null,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleEdit(
        match: Match,
    ) {

        /*
         * Double protection UI.
         */
        if (
            match.status !==
            "NOT_PLANNED"
            ||
            match.plannedReservationId !==
            null
        ) {

            return;

        }

        saveMatch.resetError();

        setSelectedMatch(
            match,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleCloseDrawer() {

        if (saveMatch.loading) {
            return;
        }

        saveMatch.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedMatch(
            null,
        );

    }

    async function handleSubmit(
        request: AdminMatchRequest,
    ) {

        if (selectedMatch) {

            await saveMatch.update(
                selectedMatch.id,
                request,
            );

        }
        else {

            await saveMatch.create(
                request,
            );

        }

        setDrawerOpen(
            false,
        );

        setSelectedMatch(
            null,
        );

        await reload();

    }

    /*
     * ============================================================
     * CHANGEMENTS DE CONTEXTE
     * ============================================================
     */

    function resetDrawer() {

        saveMatch.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedMatch(
            null,
        );

    }

    function handleCompetitionChange(
        competitionId: string,
    ) {

        resetDrawer();

        setSelectedPoolId("");
        setSelectedMatchDayId("");

        setSelectedCompetitionId(
            competitionId,
        );

    }

    function handlePoolChange(
        poolId: string,
    ) {

        resetDrawer();

        setSelectedMatchDayId("");

        setSelectedPoolId(
            poolId,
        );

    }

    function handleMatchDayChange(
        matchDayId: string,
    ) {

        resetDrawer();

        setSelectedMatchDayId(
            matchDayId,
        );

    }

    const pageLoading =
        contextLoading
        ||
        poolContextLoading
        ||
        matchesLoading;

    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

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

                        <SportsEsportsIcon
                            color="primary"
                        />

                        <Stack>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >

                                Matchs

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
                            !selectedMatchDay
                            ||
                            pageLoading
                        }
                        onClick={
                            handleCreate
                        }
                    >

                        Nouveau match

                    </Button>

                </Stack>

                {
                    contextError && (

                        <Alert severity="error">

                            Impossible de charger le contexte du championnat.

                        </Alert>

                    )
                }

                {
                    !contextLoading
                    &&
                    !activeSeason
                    && (

                        <Alert severity="warning">

                            Aucune saison active n'est configurée.

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

                        <FormControl fullWidth>

                            <InputLabel
                                id="match-competition-label"
                            >

                                Compétition

                            </InputLabel>

                            <Select
                                labelId="match-competition-label"
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

                        <FormControl fullWidth>

                            <InputLabel
                                id="match-pool-label"
                            >

                                Poule

                            </InputLabel>

                            <Select
                                labelId="match-pool-label"
                                label="Poule"
                                value={
                                    selectedPoolId
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
                 * JOURNEE
                 * ------------------------------------------------
                 */}

                {
                    selectedPool
                    &&
                    matchDays.length > 0
                    && (

                        <FormControl fullWidth>

                            <InputLabel
                                id="match-matchday-label"
                            >

                                Journée

                            </InputLabel>

                            <Select
                                labelId="match-matchday-label"
                                label="Journée"
                                value={
                                    matchDays.some(
                                        matchDay =>
                                            matchDay.id ===
                                            selectedMatchDayId,
                                    )
                                        ? selectedMatchDayId
                                        : ""
                                }
                                onChange={
                                    event =>
                                        handleMatchDayChange(
                                            event.target.value,
                                        )
                                }
                            >

                                {
                                    matchDays.map(
                                        matchDay => (

                                            <MenuItem
                                                key={
                                                    matchDay.id
                                                }
                                                value={
                                                    matchDay.id
                                                }
                                            >

                                                {
                                                    matchDay.displayName
                                                    ||
                                                    `Journée ${matchDay.number}`
                                                }

                                                {
                                                    !matchDay.active
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
                    selectedPool
                    &&
                    !poolContextLoading
                    &&
                    matchDays.length === 0
                    && (

                        <Alert severity="info">

                            Cette poule ne possède aucune journée.

                        </Alert>

                    )
                }

                {
                    matchesError && (

                        <Alert severity="error">

                            Impossible de charger les matchs.

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

                                Chargement des matchs...

                            </Typography>

                        </Stack>

                    )
                }

                {
                    !pageLoading
                    &&
                    !matchesError
                    &&
                    selectedMatchDay
                    &&
                    matches.length === 0
                    && (

                        <Alert severity="info">

                            Aucun match n'est configuré pour cette journée.

                        </Alert>

                    )
                }

                {
                    !pageLoading
                    &&
                    !matchesError
                    &&
                    matches.length > 0
                    && (

                        <Stack spacing={2}>

                            {
                                matches.map(
                                    match => (

                                        <AdminMatchCard

                                            key={
                                                match.id
                                            }

                                            match={
                                                match
                                            }

                                            homeName={
                                                registrationNamesById.get(
                                                    match.homeRegistrationId,
                                                )
                                                ??
                                                match.homeRegistrationId
                                            }

                                            awayName={
                                                registrationNamesById.get(
                                                    match.awayRegistrationId,
                                                )
                                                ??
                                                match.awayRegistrationId
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

            <MatchFormDrawer

                open={
                    drawerOpen
                }

                match={
                    selectedMatch
                }

                matchDay={
                    selectedMatchDay
                }

                registrations={
                    registrations
                }

                matches={
                    matches
                }

                loading={
                    saveMatch.loading
                }

                error={
                    saveMatch.error
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

export default MatchesPage;