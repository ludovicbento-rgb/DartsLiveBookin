import {
    Alert,
    Button,
    Checkbox,
    Chip,
    Divider,
    Drawer,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import type {
    AdminUserListItem,
    UpdateAdminUserRequest,
} from "../model/admin-user.types";

interface Props {

    open: boolean;

    user: AdminUserListItem | null;

    currentUserId: string;

    loading: boolean;

    error: string | null;

    onClose(): void;

    onSubmit(
        userId: string,
        request: UpdateAdminUserRequest,
        status: "ACTIVE" | "BLOCKED",
    ): Promise<void>;

}

function getErrorMessage(
    error: string | null,
): string | null {

    switch (error) {

        case "ROLE_REQUIRED":
            return "Au moins un rôle doit être sélectionné.";

        default:
            return error
                ? "Impossible de modifier l'utilisateur."
                : null;

    }

}

export function EditAdminUserDrawer({

    open,

    user,

    currentUserId,

    loading,

    error,

    onClose,

    onSubmit,

}: Props) {

    const [
        firstname,
        setFirstname,
    ] = useState("");

    const [
        lastname,
        setLastname,
    ] = useState("");

    const [
        email,
        setEmail,
    ] = useState("");

    const [
        player,
        setPlayer,
    ] = useState(false);

    const [
        manager,
        setManager,
    ] = useState(false);

    const [
        administrator,
        setAdministrator,
    ] = useState(false);

    const [
        status,
        setStatus,
    ] = useState<
        "ACTIVE" |
        "BLOCKED"
    >("ACTIVE");

    /*
     * ------------------------------------------------------------
     * Utilisateur actuellement connecté ?
     * ------------------------------------------------------------
     */

    const isCurrentUser =
        user?.id ===
        currentUserId;

    /*
     * ------------------------------------------------------------
     * Chargement des valeurs
     * ------------------------------------------------------------
     */

    useEffect(() => {

        if (
            !open
            ||
            !user
        ) {

            return;

        }

        setFirstname(
            user.firstname,
        );

        setLastname(
            user.lastname,
        );

        setEmail(
            user.email,
        );

        setPlayer(
            user.roles.player,
        );

        setManager(
            user.roles.manager,
        );

        setAdministrator(
            user.roles.administrator,
        );

        setStatus(
            user.status,
        );

    }, [
        open,
        user,
    ]);

    if (!user) {

        return null;

    }

    const errorMessage =
        getErrorMessage(
            error,
        );

    const hasRole =
        player
        ||
        manager
        ||
        administrator;

    const canSubmit =
        firstname.trim() !== ""
        &&
        lastname.trim() !== ""
        &&
        hasRole
        &&
        !loading;

    async function handleSubmit() {

        /*
         * Capture locale pour garantir à TypeScript
         * que l'utilisateur existe pendant toute
         * l'opération asynchrone.
         */
        const selectedUser =
            user;

        if (
            !selectedUser
            ||
            !canSubmit
        ) {

            return;

        }

        /*
         * L'administrateur connecté ne peut pas
         * retirer son propre rôle administrateur
         * ni bloquer son propre compte.
         */
        const currentUser =
            selectedUser.id ===
            currentUserId;

        const finalAdministrator =
            currentUser
                ? true
                : administrator;

        const finalStatus:
            | "ACTIVE"
            | "BLOCKED" =
            currentUser
                ? "ACTIVE"
                : status;

        await onSubmit(

            selectedUser.id,

            {

                firstname:
                    firstname.trim(),

                lastname:
                    lastname.trim(),

                email:
                    email.trim(),

                roles: {

                    player,

                    manager,

                    administrator:
                        finalAdministrator,

                },

            },

            finalStatus,

        );

    }
    return (

        <Drawer
            anchor="right"
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
        >

            <Stack
                spacing={3}
                sx={{
                    width: {
                        xs: "100vw",
                        sm: 460,
                    },

                    maxWidth:
                        "100vw",

                    p:
                        3,
                }}
            >

                <Stack spacing={0.5}>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        Modifier l'utilisateur

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        {user.firstname}
                        {" "}
                        {user.lastname}

                    </Typography>

                </Stack>

                <Divider />

                {
                    errorMessage && (

                        <Alert severity="error">

                            {errorMessage}

                        </Alert>

                    )
                }

                {
                    isCurrentUser && (

                        <Alert severity="info">

                            Vous modifiez votre propre compte.
                            Le rôle Administrateur et le statut Actif
                            sont protégés.

                        </Alert>

                    )
                }

                {/*
                 * ------------------------------------------------
                 * Licence
                 * ------------------------------------------------
                 */}

                <TextField
                    label="N° de licence"
                    value={
                        user.licenseNumber
                    }
                    disabled
                    helperText="Le numéro de licence n'est pas modifiable."
                />

                {/*
                 * ------------------------------------------------
                 * Activation
                 * ------------------------------------------------
                 */}

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        alignItems:
                            "center",
                    }}
                >

                    <Typography
                        variant="body2"
                    >

                        Compte Firebase

                    </Typography>

                    <Chip
                        size="small"
                        color={
                            user.accountActivated
                                ? "success"
                                : "default"
                        }
                        label={
                            user.accountActivated
                                ? "Activé"
                                : "Non activé"
                        }
                    />

                </Stack>

                <TextField
                    required
                    label="Prénom"
                    value={firstname}
                    disabled={loading}
                    onChange={
                        event =>
                            setFirstname(
                                event.target.value,
                            )
                    }
                />

                <TextField
                    required
                    label="Nom"
                    value={lastname}
                    disabled={loading}
                    onChange={
                        event =>
                            setLastname(
                                event.target.value,
                            )
                    }
                />

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    disabled={loading}
                    onChange={
                        event =>
                            setEmail(
                                event.target.value,
                            )
                    }
                />

                <Divider />

                {/*
                 * ------------------------------------------------
                 * Rôles
                 * ------------------------------------------------
                 */}

                <Stack spacing={1}>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        Rôles

                    </Typography>

                    <FormControlLabel

                        control={

                            <Checkbox
                                checked={player}
                                disabled={loading}
                                onChange={
                                    (_, checked) =>
                                        setPlayer(
                                            checked,
                                        )
                                }
                            />

                        }

                        label="Joueur"

                    />

                    <FormControlLabel

                        control={

                            <Checkbox
                                checked={manager}
                                disabled={loading}
                                onChange={
                                    (_, checked) =>
                                        setManager(
                                            checked,
                                        )
                                }
                            />

                        }

                        label="Gérant"

                    />

                    <FormControlLabel

                        control={

                            <Checkbox
                                checked={
                                    administrator
                                }
                                disabled={
                                    loading
                                    ||
                                    isCurrentUser
                                }
                                onChange={
                                    (_, checked) =>
                                        setAdministrator(
                                            checked,
                                        )
                                }
                            />

                        }

                        label="Administrateur"

                    />

                    {
                        !hasRole && (

                            <Alert severity="warning">

                                Au moins un rôle doit être sélectionné.

                            </Alert>

                        )
                    }

                </Stack>

                <Divider />

                {/*
                 * ------------------------------------------------
                 * Statut
                 * ------------------------------------------------
                 */}

                <FormControl>

                    <FormLabel>

                        Statut

                    </FormLabel>

                    <RadioGroup

                        value={
                            isCurrentUser
                                ? "ACTIVE"
                                : status
                        }

                        onChange={
                            event =>
                                setStatus(
                                    event.target.value as
                                    | "ACTIVE"
                                    | "BLOCKED",
                                )
                        }

                    >

                        <FormControlLabel
                            value="ACTIVE"
                            control={
                                <Radio />
                            }
                            label="Actif"
                            disabled={loading}
                        />

                        <FormControlLabel
                            value="BLOCKED"
                            control={
                                <Radio />
                            }
                            label="Bloqué"
                            disabled={
                                loading
                                ||
                                isCurrentUser
                            }
                        />

                    </RadioGroup>

                </FormControl>

                <Divider />

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                >

                    <Button
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                        onClick={
                            onClose
                        }
                    >

                        Annuler

                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={
                            !canSubmit
                        }
                        onClick={() => {

                            void handleSubmit();

                        }}
                    >

                        {
                            loading
                                ? "Enregistrement..."
                                : "Enregistrer"
                        }

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default EditAdminUserDrawer;