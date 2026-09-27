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

import SearchIcon
    from "@mui/icons-material/Search";

import PeopleIcon
    from "@mui/icons-material/People";

import {
    useMemo,
    useState,
} from "react";

import {
    AdministrationLayout,
} from "@/features/administration/layout/AdministrationLayout";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    useAdminUsers,
} from "../hooks/useAdminUsers";

import type {
    AdminUserListItem,
    CreateAdminUserRequest,
} from "../model/admin-user.types";

import {
    AdminUserCard,
} from "../components/AdminUserCard";

import {
    EditAdminUserDrawer,
} from "../components/EditAdminUserDrawer";

import {
    useUpdateAdminUser,
} from "../hooks/useUpdateAdminUser";

import type {
    UpdateAdminUserRequest,
} from "../model/admin-user.types";

import {
    getActiveSeason,
} from "@/entities/season";

import type {
    Season,
} from "@/entities/season";

import {
    useEffect,
} from "react";

import {
    CreateAdminUserDrawer,
} from "../components/CreateAdminUserDrawer";

import {
    useCreateAdminUser,
} from "../hooks/useCreateAdminUser";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import {
    useNavigate,
} from "react-router-dom";

export function UsersPage() {

    const navigate =
        useNavigate();

    const profile =
        useCurrentUser();

    const {

        users,
        loading,
        error,
        reload,

    } = useAdminUsers();

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        createDrawerOpen,
        setCreateDrawerOpen,
    ] = useState(false);

    const [
        activeSeason,
        setActiveSeason,
    ] = useState<Season | null>(
        null,
    );

    const createUser =
        useCreateAdminUser();

    const [
        selectedUser,
        setSelectedUser,
    ] = useState<AdminUserListItem | null>(
        null,
    );

    const [
        editDrawerOpen,
        setEditDrawerOpen,
    ] = useState(false);

    const updateUser =
        useUpdateAdminUser();

    useEffect(() => {

        let cancelled =
            false;

        void getActiveSeason()
            .then(season => {

                if (!cancelled) {

                    setActiveSeason(
                        season,
                    );

                }

            })
            .catch(error => {

                console.error(
                    "ACTIVE_SEASON_LOAD_FAILED",
                    error,
                );

            });

        return () => {

            cancelled =
                true;

        };

    }, []);

    /*
     * ------------------------------------------------------------
     * Recherche locale
     * ------------------------------------------------------------
     */

    const filteredUsers =
        useMemo(
            () => {

                const value =
                    search
                        .trim()
                        .toLocaleLowerCase(
                            "fr",
                        );

                if (value === "") {

                    return users;

                }

                return users.filter(
                    user => {

                        const searchable =
                            [
                                user.firstname,
                                user.lastname,
                                user.licenseNumber,
                                user.email,
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
                users,
                search,
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

                    Vous n'êtes pas autorisé à gérer les utilisateurs.

                </Alert>

            </AdministrationLayout>

        );

    }

    /*
     * ------------------------------------------------------------
     * Actions
     *
     * Les formulaires seront ajoutés à l'étape suivante.
     * ------------------------------------------------------------
     */



    async function handleEditSubmit(

        userId: string,

        request: UpdateAdminUserRequest,

        status:
            | "ACTIVE"
            | "BLOCKED",

    ) {

        await updateUser.update(
            userId,
            request,
            status,
        );

        setEditDrawerOpen(
            false,
        );

        setSelectedUser(
            null,
        );

        await reload();

    }

    function handleCreate() {

        createUser.resetError();

        setCreateDrawerOpen(
            true,
        );

    }

    async function handleCreateSubmit(
        request: CreateAdminUserRequest,
    ) {

        await createUser.create(
            request,
        );

        setCreateDrawerOpen(
            false,
        );

        await reload();

    }
    function handleEdit(
        user: AdminUserListItem,
    ) {

        updateUser.resetError();

        setSelectedUser(
            user,
        );

        setEditDrawerOpen(
            true,
        );

    }

    return (

        <AdministrationLayout>

            <Stack spacing={3}>
                <Stack spacing={2}>

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

                            <PeopleIcon
                                color="primary"
                            />

                            <Stack>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight:
                                            700,
                                    }}
                                >

                                    Utilisateurs

                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >

                                    Comptes, rôles et activations

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

                            Nouvel utilisateur

                        </Button>

                    </Stack>

                </Stack>

                {/*
                 * ------------------------------------------------
                 * Recherche
                 * ------------------------------------------------
                 */}

                <TextField
                    fullWidth
                    value={search}
                    placeholder="Rechercher par nom, prénom, licence ou email"
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
                 * Erreur
                 * ------------------------------------------------
                 */}

                {
                    error && (

                        <Alert severity="error">

                            Impossible de charger les utilisateurs.

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

                                py:
                                    4,
                            }}
                        >

                            <CircularProgress />

                            <Typography
                                color="text.secondary"
                            >

                                Chargement des utilisateurs...

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
                    !error
                    && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >

                            {
                                filteredUsers.length === 0
                                    ? "Aucun utilisateur"
                                    : filteredUsers.length === 1
                                        ? "1 utilisateur"
                                        : `${filteredUsers.length} utilisateurs`
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
                    !error
                    &&
                    filteredUsers.length > 0
                    && (

                        <Stack spacing={2}>

                            {
                                filteredUsers.map(
                                    user => (

                                        <AdminUserCard

                                            key={
                                                user.id
                                            }

                                            user={
                                                user
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
                    !error
                    &&
                    users.length > 0
                    &&
                    filteredUsers.length === 0
                    && (

                        <Alert severity="info">

                            Aucun utilisateur ne correspond à votre recherche.

                        </Alert>

                    )
                }

            </Stack>

            <CreateAdminUserDrawer

                open={
                    createDrawerOpen
                }

                loading={
                    createUser.loading
                }

                error={
                    createUser.error
                }

                activeSeason={
                    activeSeason
                }

                onClose={() => {

                    if (
                        createUser.loading
                    ) {

                        return;

                    }

                    createUser.resetError();

                    setCreateDrawerOpen(
                        false,
                    );

                }}

                onSubmit={
                    handleCreateSubmit
                }

            />

            <EditAdminUserDrawer

                open={
                    editDrawerOpen
                }

                user={
                    selectedUser
                }

                currentUserId={
                    profile.id
                }

                loading={
                    updateUser.loading
                }

                error={
                    updateUser.error
                }

                onClose={() => {

                    if (
                        updateUser.loading
                    ) {

                        return;

                    }

                    updateUser.resetError();

                    setEditDrawerOpen(
                        false,
                    );

                    setSelectedUser(
                        null,
                    );

                }}

                onSubmit={
                    handleEditSubmit
                }

            />

        </AdministrationLayout>

    );

}

export default UsersPage;