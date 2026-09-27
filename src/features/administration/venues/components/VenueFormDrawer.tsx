import {
    Alert,
    Button,
    Checkbox,
    Divider,
    Drawer,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import type {
    Venue,
} from "@/entities/venue";

import type {
    AdminUserListItem,
} from "../../users/model/admin-user.types";

import type {
    AdminVenueRequest,
} from "../model/admin-venue.types";

interface Props {

    open: boolean;

    venue: Venue | null;

    managers: AdminUserListItem[];

    loading: boolean;

    error: string | null;

    onClose(): void;

    onSubmit(
        request: AdminVenueRequest,
    ): Promise<void>;

}

function getErrorMessage(
    error: string | null,
): string | null {

    switch (error) {

        case "VENUE_NAME_REQUIRED":
            return "Le nom de l'établissement est obligatoire.";

        case "VENUE_CITY_REQUIRED":
            return "La ville est obligatoire.";

        case "VENUE_BOARD_COUNT_INVALID":
            return "Le nombre de cibles doit être supérieur ou égal à 1.";

        default:
            return error
                ? "Impossible d'enregistrer l'établissement."
                : null;

    }

}

export function VenueFormDrawer({

    open,

    venue,

    managers,

    loading,

    error,

    onClose,

    onSubmit,

}: Props) {

    const [
        name,
        setName,
    ] = useState("");

    const [
        city,
        setCity,
    ] = useState("");

    const [
        address,
        setAddress,
    ] = useState("");

    const [
        boardCount,
        setBoardCount,
    ] = useState(1);

    const [
        logo,
        setLogo,
    ] = useState("");

    const [
        active,
        setActive,
    ] = useState(true);

    const [
        managerUserIds,
        setManagerUserIds,
    ] = useState<string[]>([]);

    useEffect(() => {

        if (!open) {
            return;
        }

        if (venue) {

            setName(
                venue.name,
            );

            setCity(
                venue.city,
            );

            setAddress(
                venue.address,
            );

            setBoardCount(
                venue.boardCount,
            );

            setLogo(
                venue.logo ?? "",
            );

            setActive(
                venue.active,
            );

            setManagerUserIds(
                venue.managerUserIds,
            );

            return;

        }

        setName("");
        setCity("");
        setAddress("");
        setBoardCount(1);
        setLogo("");
        setActive(true);
        setManagerUserIds([]);

    }, [
        open,
        venue,
    ]);

    function toggleManager(
        userId: string,
        checked: boolean,
    ) {

        setManagerUserIds(
            current => {

                if (checked) {

                    return Array.from(
                        new Set([
                            ...current,
                            userId,
                        ]),
                    );

                }

                return current.filter(
                    id =>
                        id !== userId,
                );

            },
        );

    }

    const canSubmit =
        name.trim() !== ""
        &&
        city.trim() !== ""
        &&
        Number.isInteger(
            boardCount,
        )
        &&
        boardCount >= 1
        &&
        !loading;

    async function handleSubmit() {

        if (!canSubmit) {
            return;
        }

        await onSubmit({

            name:
                name.trim(),

            city:
                city.trim(),

            address:
                address.trim(),

            boardCount,

            logo:
                logo.trim() === ""
                    ? null
                    : logo.trim(),

            active,

            managerUserIds,

        });

    }

    const errorMessage =
        getErrorMessage(
            error,
        );

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
                        sm: 480,
                    },

                    maxWidth:
                        "100vw",

                    p: 3,
                }}
            >

                <Stack spacing={0.5}>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        {
                            venue
                                ? "Modifier l'établissement"
                                : "Nouvel établissement"
                        }

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        Configuration de l'établissement

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

                <TextField
                    required
                    label="Nom"
                    value={name}
                    disabled={loading}
                    onChange={
                        event =>
                            setName(
                                event.target.value,
                            )
                    }
                />

                <TextField
                    required
                    label="Ville"
                    value={city}
                    disabled={loading}
                    onChange={
                        event =>
                            setCity(
                                event.target.value,
                            )
                    }
                />

                <TextField
                    label="Adresse"
                    value={address}
                    disabled={loading}
                    onChange={
                        event =>
                            setAddress(
                                event.target.value,
                            )
                    }
                />

                <TextField
                    required
                    label="Nombre de cibles"
                    type="number"
                    value={boardCount}
                    disabled={loading}
                    slotProps={{
                        htmlInput: {
                            min: 1,
                            step: 1,
                        },
                    }}
                    onChange={
                        event =>
                            setBoardCount(
                                Number(
                                    event.target.value,
                                ),
                            )
                    }
                />

                <TextField
                    label="Logo"
                    value={logo}
                    disabled={loading}
                    helperText="Nom du fichier logo dans /images/venues"
                    onChange={
                        event =>
                            setLogo(
                                event.target.value,
                            )
                    }
                />

                <FormControlLabel

                    control={

                        <Switch
                            checked={active}
                            disabled={loading}
                            onChange={
                                (_, checked) =>
                                    setActive(
                                        checked,
                                    )
                            }
                        />

                    }

                    label={
                        active
                            ? "Établissement actif"
                            : "Établissement inactif"
                    }

                />

                <Divider />

                <Stack spacing={1}>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        Gérants

                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        Sélectionnez les utilisateurs autorisés
                        à gérer cet établissement.

                    </Typography>

                    {
                        managers.length === 0
                            ? (

                                <Alert severity="info">

                                    Aucun utilisateur actif ne possède
                                    actuellement le rôle Gérant.

                                </Alert>

                            )
                            : managers.map(
                                manager => (

                                    <FormControlLabel

                                        key={
                                            manager.id
                                        }

                                        control={

                                            <Checkbox
                                                checked={
                                                    managerUserIds.includes(
                                                        manager.id,
                                                    )
                                                }
                                                disabled={
                                                    loading
                                                }
                                                onChange={
                                                    (_, checked) =>
                                                        toggleManager(
                                                            manager.id,
                                                            checked,
                                                        )
                                                }
                                            />

                                        }

                                        label={
                                            `${manager.firstname} ${manager.lastname}`
                                        }

                                    />

                                ),
                            )
                    }

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
                                ? "Enregistrement..."
                                : venue
                                    ? "Enregistrer"
                                    : "Créer"
                        }

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default VenueFormDrawer;