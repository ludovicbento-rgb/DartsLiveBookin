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
    getPoolsByCompetition,
} from "@/entities/pool";

import type {
    Registration,
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
    useAdminUsers,
} from "@/features/administration/users/hooks/useAdminUsers";

import {
    useAdminVenues,
} from "@/features/administration/venues/hooks/useAdminVenues";

import {
    AdministrationLayout,
} from "@/features/administration/layout/AdministrationLayout";

import {
    AdminRegistrationCard,
} from "../components/AdminRegistrationCard";

import {
    useAdminRegistrations,
} from "../hooks/useAdminRegistrations";

import {
    RegistrationFormDrawer,
} from "../components/RegistrationFormDrawer";

import {
    useSaveAdminRegistration,
} from "../hooks/useSaveAdminRegistration";

import type {
    AdminRegistrationRequest,
} from "../model/admin-registration.types";

export function RegistrationsPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    /*
     * ============================================================
     * Contexte championnat
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

    const saveRegistration =
        useSaveAdminRegistration();

    const [
        drawerOpen,
        setDrawerOpen,
    ] = useState(false);

    const [
        selectedRegistration,
        setSelectedRegistration,
    ] = useState<Registration | null>(
        null,
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
        contextError,
        setContextError,
    ] = useState(false);

    /*
     * ------------------------------------------------------------
     * Saison + compétitions
     * ------------------------------------------------------------
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
                    setPools([]);

                    setSelectedCompetitionId("");
                    setSelectedPoolId("");

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

                /*
                 * Première compétition active par défaut.
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
                    "ADMIN_REGISTRATIONS_CONTEXT_LOAD_FAILED",
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
     * Poules de la compétition sélectionnée
     * ------------------------------------------------------------
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

                const result =
                    await getPoolsByCompetition(
                        selectedCompetitionId,
                    );

                if (cancelled) {
                    return;
                }

                const sorted =
                    [...result].sort(
                        (a, b) => {

                            const order =
                                a.order -
                                b.order;

                            if (order !== 0) {
                                return order;
                            }

                            return a.name.localeCompare(
                                b.name,
                                "fr",
                            );

                        },
                    );

                setPools(
                    sorted,
                );

                const defaultPool =
                    sorted.find(
                        pool =>
                            pool.active,
                    )
                    ??
                    sorted[0];

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
                    "ADMIN_REGISTRATION_POOLS_LOAD_FAILED",
                    error,
                );

                setContextError(
                    true,
                );

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
     * Référentiels
     * ============================================================
     */

    const {
        users,
        loading:
        usersLoading,
        error:
        usersError,
    } = useAdminUsers();

    const {
        venues,
        loading:
        venuesLoading,
        error:
        venuesError,
    } = useAdminVenues();

    /*
     * ============================================================
     * Inscriptions
     * ============================================================
     */

    const {
        registrations,
        loading:
        registrationsLoading,
        error:
        registrationsError,
        reload,
    } = useAdminRegistrations(
        selectedCompetitionId,
        selectedPoolId,
    );

    /*
     * ============================================================
     * Maps de résolution
     * ============================================================
     */

    const userNamesById =
        useMemo(
            () => {

                const result =
                    new Map<
                        string,
                        string
                    >();

                for (const user of users) {

                    result.set(
                        user.id,
                        `${user.firstname} ${user.lastname}`,
                    );

                }

                return result;

            },
            [
                users,
            ],
        );

    const venueNamesById =
        useMemo(
            () => {

                const result =
                    new Map<
                        string,
                        string
                    >();

                for (const venue of venues) {

                    result.set(
                        venue.id,
                        venue.name,
                    );

                }

                return result;

            },
            [
                venues,
            ],
        );

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
     * Sécurité UI
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

                    Vous n'êtes pas autorisé à gérer les inscriptions.

                </Alert>

            </AdministrationLayout>

        );

    }

    function handleCreate() {

        if (
            !selectedCompetition
            ||
            !selectedPool
        ) {

            return;

        }

        saveRegistration.resetError();

        setSelectedRegistration(
            null,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleEdit(
        registration: Registration,
    ) {

        saveRegistration.resetError();

        setSelectedRegistration(
            registration,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleCloseDrawer() {

        if (
            saveRegistration.loading
        ) {

            return;

        }

        saveRegistration.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedRegistration(
            null,
        );

    }

    async function handleRegistrationSubmit(
        request: AdminRegistrationRequest,
    ) {

        if (selectedRegistration) {

            await saveRegistration.update(
                selectedRegistration.id,
                request,
            );

        }
        else {

            await saveRegistration.create(
                request,
            );

        }

        setDrawerOpen(
            false,
        );

        setSelectedRegistration(
            null,
        );

        await reload();

    }

    function handlePoolChange(
        poolId: string,
    ) {

        saveRegistration.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedRegistration(
            null,
        );

        setSelectedPoolId(
            poolId,
        );

    }

    function handleCompetitionChange(
        competitionId: string,
    ) {

        setSelectedPoolId("");

        setSelectedCompetitionId(
            competitionId,
        );

        setDrawerOpen(
            false,
        );

        setSelectedRegistration(
            null,
        );

    }

    const pageLoading =
        contextLoading
        ||
        usersLoading
        ||
        venuesLoading
        ||
        registrationsLoading;

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

                                Inscriptions

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
                        }
                        onClick={
                            handleCreate
                        }
                    >

                        Nouvelle inscription

                    </Button>

                </Stack>

                {/*
                 * ------------------------------------------------
                 * Erreurs de contexte
                 * ------------------------------------------------
                 */}

                {
                    contextError && (

                        <Alert severity="error">

                            Impossible de charger le contexte du championnat.

                        </Alert>

                    )
                }

                {
                    usersError && (

                        <Alert severity="warning">

                            Impossible de charger le référentiel des utilisateurs.

                        </Alert>

                    )
                }

                {
                    venuesError && (

                        <Alert severity="warning">

                            Impossible de charger le référentiel des établissements.

                        </Alert>

                    )
                }

                {
                    registrationsError && (

                        <Alert severity="error">

                            Impossible de charger les inscriptions.

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

                {/*
                 * ------------------------------------------------
                 * Compétition
                 * ------------------------------------------------
                 */}

                {
                    competitions.length > 0 && (

                        <FormControl fullWidth>

                            <InputLabel
                                id="registration-competition-label"
                            >

                                Compétition

                            </InputLabel>

                            <Select
                                labelId="registration-competition-label"
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
                 * Poule
                 * ------------------------------------------------
                 */}

                {
                    selectedCompetition
                    &&
                    pools.length > 0
                    && (

                        <FormControl fullWidth>

                            <InputLabel
                                id="registration-pool-label"
                            >

                                Poule

                            </InputLabel>

                            <Select
                                labelId="registration-pool-label"
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

                {
                    selectedCompetition
                    &&
                    !contextLoading
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
                 * Chargement
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

                                Chargement des inscriptions...

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
                    !pageLoading
                    &&
                    !registrationsError
                    &&
                    selectedPool
                    &&
                    registrations.length === 0
                    && (

                        <Alert severity="info">

                            Aucune inscription n'est configurée dans cette poule.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * Liste
                 * ------------------------------------------------
                 */}

                {
                    !pageLoading
                    &&
                    !registrationsError
                    &&
                    registrations.length > 0
                    && (

                        <Stack spacing={2}>

                            {
                                registrations.map(
                                    registration => (

                                        <AdminRegistrationCard

                                            key={
                                                registration.id
                                            }

                                            registration={
                                                registration
                                            }

                                            captainName={
                                                userNamesById.get(
                                                    registration.captainId,
                                                )
                                                ??
                                                registration.captainId
                                            }

                                            playerNames={
                                                registration.playerIds.map(
                                                    playerId =>
                                                        userNamesById.get(
                                                            playerId,
                                                        )
                                                        ??
                                                        playerId,
                                                )
                                            }

                                            venueName={
                                                venueNamesById.get(
                                                    registration.homeVenueId,
                                                )
                                                ??
                                                registration.homeVenueId
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

            <RegistrationFormDrawer

                open={
                    drawerOpen
                }

                registration={
                    selectedRegistration
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

                users={
                    users
                }

                venues={
                    venues
                }

                loading={
                    saveRegistration.loading
                }

                error={
                    saveRegistration.error
                }

                onClose={
                    handleCloseDrawer
                }

                onSubmit={
                    handleRegistrationSubmit
                }

            />

        </AdministrationLayout>

    );

}

export default RegistrationsPage;