import {
    Alert,
    Button,
    Checkbox,
    Divider,
    Drawer,
    FormControlLabel,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import type {
    Season,
} from "@/entities/season";

import type {
    CreateAdminUserRequest,
} from "../model/admin-user.types";

interface Props {

    open: boolean;

    loading: boolean;

    error: string | null;

    activeSeason: Season | null;

    onClose(): void;

    onSubmit(
        request: CreateAdminUserRequest,
    ): Promise<void>;

}

function getErrorMessage(
    error: string | null,
): string | null {

    switch (error) {

        case "LICENSE_ALREADY_EXISTS":
            return "Ce numéro de licence est déjà utilisé.";

        case "LICENSE_REQUIRED":
            return "Le numéro de licence est obligatoire.";

        case "NAME_REQUIRED":
            return "Le prénom et le nom sont obligatoires.";

        case "ROLE_REQUIRED":
            return "Au moins un rôle doit être sélectionné.";

        default:
            return error
                ? "Impossible de créer l'utilisateur."
                : null;

    }

}

export function CreateAdminUserDrawer({

    open,

    loading,

    error,

    activeSeason,

    onClose,

    onSubmit,

}: Props) {

    const [
        licenseNumber,
        setLicenseNumber,
    ] = useState("");

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
    ] = useState(true);

    const [
        manager,
        setManager,
    ] = useState(false);

    const [
        administrator,
        setAdministrator,
    ] = useState(false);

    /*
     * On réinitialise le formulaire
     * à chaque nouvelle ouverture.
     */
    useEffect(() => {

        if (!open) {
            return;
        }

        setLicenseNumber("");
        setFirstname("");
        setLastname("");
        setEmail("");

        setPlayer(true);
        setManager(false);
        setAdministrator(false);

    }, [
        open,
    ]);

    const errorMessage =
        getErrorMessage(
            error,
        );

    const canSubmit =
        licenseNumber.trim() !== ""
        &&
        firstname.trim() !== ""
        &&
        lastname.trim() !== ""
        &&
        activeSeason !== null
        &&
        (
            player
            ||
            manager
            ||
            administrator
        )
        &&
        !loading;

    async function handleSubmit() {

        if (
            !activeSeason
            ||
            !canSubmit
        ) {

            return;

        }

        await onSubmit({

            licenseNumber:
                licenseNumber.trim(),

            firstname:
                firstname.trim(),

            lastname:
                lastname.trim(),

            email:
                email.trim(),

            seasonId:
                activeSeason.id,

            roles: {

                player,

                manager,

                administrator,

            },

        });

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

                        Nouvel utilisateur

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        Créer un profil DartsLive Bookin

                    </Typography>

                </Stack>

                <Divider />

                {
                    !activeSeason && (

                        <Alert severity="error">

                            Aucune saison active n'est configurée.
                            La création d'un utilisateur est impossible.

                        </Alert>

                    )
                }

                {
                    errorMessage && (

                        <Alert severity="error">

                            {errorMessage}

                        </Alert>

                    )
                }

                <TextField
                    required
                    label="N° de licence"
                    value={licenseNumber}
                    disabled={loading}
                    onChange={
                        event =>
                            setLicenseNumber(
                                event.target.value,
                            )
                    }
                />

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

                <Stack spacing={0.5}>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >

                        Saison

                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 600,
                        }}
                    >

                        {
                            activeSeason?.name
                            ??
                            "Aucune saison active"
                        }

                    </Typography>

                </Stack>

                <Divider />

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
                                checked={administrator}
                                disabled={loading}
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

                </Stack>

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
                                ? "Création..."
                                : "Créer"
                        }

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default CreateAdminUserDrawer;