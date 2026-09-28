import {
    Alert,
    Button,
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
    Pool,
} from "@/entities/pool";

import type {
    AdminPoolRequest,
} from "../model/admin-pool.types";

interface Props {

    open: boolean;

    pool: Pool | null;

    competitionId: string;

    competitionName: string;

    loading: boolean;

    error: string | null;

    onClose(): void;

    onSubmit(
        request: AdminPoolRequest,
    ): Promise<void>;

}

function getErrorMessage(
    error: string | null,
): string | null {

    switch (error) {

        case "POOL_COMPETITION_REQUIRED":
            return "Aucune compétition n'est sélectionnée.";

        case "POOL_NAME_REQUIRED":
            return "Le nom de la poule est obligatoire.";

        case "POOL_ORDER_INVALID":
            return "L'ordre de la poule est invalide.";

        default:
            return error
                ? "Impossible d'enregistrer la poule."
                : null;

    }

}

export function PoolFormDrawer({

    open,

    pool,

    competitionId,

    competitionName,

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
        order,
        setOrder,
    ] = useState(1);

    const [
        active,
        setActive,
    ] = useState(true);

    useEffect(() => {

        if (!open) {
            return;
        }

        if (pool) {

            setName(
                pool.name,
            );

            setOrder(
                pool.order,
            );

            setActive(
                pool.active,
            );

            return;

        }

        setName("");
        setOrder(1);
        setActive(true);

    }, [
        open,
        pool,
    ]);

    const canSubmit =
        competitionId !== ""
        &&
        name.trim() !== ""
        &&
        Number.isInteger(
            order,
        )
        &&
        order >= 0
        &&
        !loading;

    async function handleSubmit() {

        if (!canSubmit) {
            return;
        }

        await onSubmit({

            competitionId,

            name:
                name.trim(),

            order,

            active,

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
                        sm: 460,
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
                            pool
                                ? "Modifier la poule"
                                : "Nouvelle poule"
                        }

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        {competitionName}

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
                    autoFocus
                    label="Nom"
                    value={name}
                    disabled={loading}
                    placeholder="Ex. Poule 9"
                    onChange={
                        event =>
                            setName(
                                event.target.value,
                            )
                    }
                />

                <TextField
                    required
                    label="Ordre"
                    type="number"
                    value={order}
                    disabled={loading}
                    slotProps={{
                        htmlInput: {
                            min: 0,
                            step: 1,
                        },
                    }}
                    onChange={
                        event =>
                            setOrder(
                                Number(
                                    event.target.value,
                                ),
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
                            ? "Poule active"
                            : "Poule inactive"
                    }

                />

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
                                : pool
                                    ? "Enregistrer"
                                    : "Créer"
                        }

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default PoolFormDrawer;