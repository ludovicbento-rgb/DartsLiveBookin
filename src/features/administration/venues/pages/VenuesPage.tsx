import {
    Alert,
    Button,
    CircularProgress,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon
    from "@mui/icons-material/Add";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import SearchIcon
    from "@mui/icons-material/Search";

import StorefrontIcon
    from "@mui/icons-material/Storefront";

import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    Venue,
} from "@/entities/venue";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    useAdminUsers,
} from "@/features/administration/users/hooks/useAdminUsers";

import {
    AdministrationLayout,
} from "@/features/administration/layout/AdministrationLayout";

import {
    AdminVenueCard,
} from "../components/AdminVenueCard";

import {
    VenueFormDrawer,
} from "../components/VenueFormDrawer";

import {
    useAdminVenues,
} from "../hooks/useAdminVenues";

import {
    useSaveAdminVenue,
} from "../hooks/useSaveAdminVenue";

import type {
    AdminVenueRequest,
} from "../model/admin-venue.types";

export function VenuesPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    const {
        venues,
        loading,
        error,
        reload,
    } = useAdminVenues();

    /*
     * On réutilise le référentiel utilisateurs
     * construit dans PR-142.
     */
    const {
        users,
        loading:
        usersLoading,
        error:
        usersError,
    } = useAdminUsers();

    const saveVenue =
        useSaveAdminVenue();

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        drawerOpen,
        setDrawerOpen,
    ] = useState(false);

    const [
        selectedVenue,
        setSelectedVenue,
    ] = useState<Venue | null>(
        null,
    );

    /*
     * ------------------------------------------------------------
     * Gérants disponibles
     * ------------------------------------------------------------
     *
     * Un établissement référence les ID métier users/<id>,
     * jamais les Firebase UID.
     */
    const managers =
        useMemo(
            () =>
                users
                    .filter(
                        user =>
                            user.status === "ACTIVE"
                            &&
                            user.roles.manager,
                    )
                    .sort(
                        (a, b) => {

                            const lastname =
                                a.lastname.localeCompare(
                                    b.lastname,
                                    "fr",
                                );

                            if (lastname !== 0) {
                                return lastname;
                            }

                            return a.firstname.localeCompare(
                                b.firstname,
                                "fr",
                            );

                        },
                    ),
            [
                users,
            ],
        );

    /*
     * ------------------------------------------------------------
     * Résolution des noms des gérants
     * ------------------------------------------------------------
     */

    const managerNamesById =
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

    /*
     * ------------------------------------------------------------
     * Recherche
     * ------------------------------------------------------------
     */

    const filteredVenues =
        useMemo(
            () => {

                const value =
                    search
                        .trim()
                        .toLocaleLowerCase(
                            "fr",
                        );

                if (value === "") {

                    return venues;

                }

                return venues.filter(
                    venue => {

                        const managerNames =
                            venue.managerUserIds
                                .map(
                                    managerId =>
                                        managerNamesById.get(
                                            managerId,
                                        )
                                        ?? "",
                                )
                                .join(" ");

                        const searchable =
                            [
                                venue.name,
                                venue.city,
                                venue.address,
                                managerNames,
                            ]
                                .join(" ")
                                .toLocaleLowerCase(
                                    "fr",
                                );

                        return searchable.includes(
                            value,
                        );

                    },
                );

            },
            [
                venues,
                search,
                managerNamesById,
            ],
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

                    Vous n'êtes pas autorisé à gérer les établissements.

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

        saveVenue.resetError();

        setSelectedVenue(
            null,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleEdit(
        venue: Venue,
    ) {

        saveVenue.resetError();

        setSelectedVenue(
            venue,
        );

        setDrawerOpen(
            true,
        );

    }

    function handleClose() {

        if (saveVenue.loading) {
            return;
        }

        saveVenue.resetError();

        setDrawerOpen(
            false,
        );

        setSelectedVenue(
            null,
        );

    }

    async function handleSubmit(
        request: AdminVenueRequest,
    ) {

        if (selectedVenue) {

            await saveVenue.update(
                selectedVenue.id,
                request,
            );

        }
        else {

            await saveVenue.create(
                request,
            );

        }

        setDrawerOpen(
            false,
        );

        setSelectedVenue(
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

                        <StorefrontIcon
                            color="primary"
                        />

                        <Stack>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >

                                Établissements

                            </Typography>

                            <Typography
                                color="text.secondary"
                            >

                                Bars affiliés, cibles et gérants

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

                        Nouvel établissement

                    </Button>

                </Stack>

                {/*
                 * ------------------------------------------------
                 * Recherche
                 * ------------------------------------------------
                 */}

                <TextField
                    fullWidth
                    value={search}
                    placeholder="Rechercher par nom, ville, adresse ou gérant"
                    onChange={
                        event =>
                            setSearch(
                                event.target.value,
                            )
                    }
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">

                                    <SearchIcon />

                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/*
                 * ------------------------------------------------
                 * Erreurs
                 * ------------------------------------------------
                 */}

                {
                    error && (

                        <Alert severity="error">

                            Impossible de charger les établissements.

                        </Alert>

                    )
                }

                {
                    usersError && (

                        <Alert severity="warning">

                            Les utilisateurs n'ont pas pu être chargés.
                            L'affectation des gérants peut être indisponible.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * Chargement
                 * ------------------------------------------------
                 */}

                {
                    (
                        loading
                        ||
                        usersLoading
                    )
                    && (

                        <Stack
                            spacing={2}
                            sx={{
                                alignItems:
                                    "center",

                                py:
                                    4,
                            }}
                        >

                            <CircularProgress />

                            <Typography
                                color="text.secondary"
                            >

                                Chargement des établissements...

                            </Typography>

                        </Stack>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * Compteur
                 * ------------------------------------------------
                 */}

                {
                    !loading
                    &&
                    !usersLoading
                    &&
                    !error
                    && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >

                            {
                                filteredVenues.length === 0
                                    ? "Aucun établissement"
                                    : filteredVenues.length === 1
                                        ? "1 établissement"
                                        : `${filteredVenues.length} établissements`
                            }

                        </Typography>

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
                    !usersLoading
                    &&
                    !error
                    &&
                    filteredVenues.length > 0
                    && (

                        <Stack spacing={2}>

                            {
                                filteredVenues.map(
                                    venue => (

                                        <AdminVenueCard

                                            key={
                                                venue.id
                                            }

                                            venue={
                                                venue
                                            }

                                            managerNames={
                                                venue.managerUserIds
                                                    .map(
                                                        managerId =>
                                                            managerNamesById.get(
                                                                managerId,
                                                            )
                                                            ?? managerId,
                                                    )
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

                {/*
                 * ------------------------------------------------
                 * Recherche sans résultat
                 * ------------------------------------------------
                 */}

                {
                    !loading
                    &&
                    !usersLoading
                    &&
                    !error
                    &&
                    venues.length > 0
                    &&
                    filteredVenues.length === 0
                    && (

                        <Alert severity="info">

                            Aucun établissement ne correspond à votre recherche.

                        </Alert>

                    )
                }

            </Stack>

            <VenueFormDrawer

                open={
                    drawerOpen
                }

                venue={
                    selectedVenue
                }

                managers={
                    managers
                }

                loading={
                    saveVenue.loading
                }

                error={
                    saveVenue.error
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

export default VenuesPage;