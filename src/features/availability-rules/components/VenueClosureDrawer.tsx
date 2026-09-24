import {
    Alert,
    Button,
    Drawer,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    useState,
    useEffect,
} from "react";

import type {
    VenueClosureReason,
} from "@/entities/venue-closure";

export interface VenueClosureForm {

    reasonType: VenueClosureReason;

    startDate: string;

    endDate: string;

    comment: string;

}

interface Props {

    open: boolean;

    loading: boolean;

    onClose(): void;

    onCreate(
        form: VenueClosureForm,
    ): Promise<void>;

}

export function VenueClosureDrawer({

    open,

    loading,

    onClose,

    onCreate,

}: Props) {

    const [
        reasonType,
        setReasonType,
    ] = useState<VenueClosureReason>(
        "VACATION",
    );

    const [
        startDate,
        setStartDate,
    ] = useState("");

    const [
        endDate,
        setEndDate,
    ] = useState("");

    const [
        comment,
        setComment,
    ] = useState("");

    const invalidDateRange =

        startDate !== ""

        &&

        endDate !== ""

        &&

        startDate > endDate;

    function reset() {

        setReasonType(
            "VACATION",
        );

        setStartDate("");

        setEndDate("");

        setComment("");

    }

    useEffect(() => {

        if (!open) {

            reset();

        }

    }, [
        open,
    ]);


    function handleClose() {

        if (loading) {

            return;

        }

        reset();

        onClose();

    }

    async function handleSubmit() {

        if (
            loading
            ||
            startDate === ""
            ||
            endDate === ""
            ||
            invalidDateRange
        ) {

            return;

        }

        await onCreate({

            reasonType,

            startDate,

            endDate,

            comment:
                comment.trim(),

        });

    }

    return (

        <Drawer

            anchor="right"

            open={open}

            onClose={
                loading
                    ? undefined
                    : handleClose
            }

            slotProps={{

                paper: {

                    sx: {

                        width: {

                            xs: "100%",

                            sm: 500,

                        },

                        p: 3,

                    },

                },

            }}

        >

            <Stack spacing={3}>

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                    }}
                >

                    Nouvelle fermeture exceptionnelle

                </Typography>

                <FormControl fullWidth>

                    <InputLabel>

                        Motif

                    </InputLabel>

                    <Select

                        value={reasonType}

                        label="Motif"

                        onChange={event =>

                            setReasonType(

                                event.target.value as VenueClosureReason,

                            )

                        }

                    >

                        <MenuItem value="VACATION">

                            Vacances

                        </MenuItem>

                        <MenuItem value="PRIVATE_EVENT">

                            Privatisation

                        </MenuItem>

                        <MenuItem value="MAINTENANCE">

                            Maintenance

                        </MenuItem>

                        <MenuItem value="INVENTORY">

                            Inventaire

                        </MenuItem>

                        <MenuItem value="OTHER">

                            Autre

                        </MenuItem>

                    </Select>

                </FormControl>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                >

                    <TextField

                        label="Date de début"

                        type="date"

                        value={startDate}

                        onChange={event =>

                            setStartDate(
                                event.target.value,
                            )

                        }

                        slotProps={{

                            inputLabel: {

                                shrink: true,

                            },

                        }}

                        fullWidth

                    />

                    <TextField

                        label="Date de fin"

                        type="date"

                        value={endDate}

                        onChange={event =>

                            setEndDate(
                                event.target.value,
                            )

                        }

                        slotProps={{

                            inputLabel: {

                                shrink: true,

                            },

                        }}

                        fullWidth

                    />

                </Stack>

                {
                    invalidDateRange && (

                        <Alert severity="error">

                            La date de fin doit être
                            postérieure ou égale à la
                            date de début.

                        </Alert>

                    )
                }

                <TextField

                    label="Commentaire"

                    value={comment}

                    onChange={event =>

                        setComment(
                            event.target.value,
                        )

                    }

                    multiline

                    minRows={3}

                    fullWidth

                />

                <Alert severity="info">

                    L'établissement sera totalement
                    indisponible aux réservations
                    pendant cette période.

                </Alert>

                <Stack
                    direction={{
                        xs: "column-reverse",
                        sm: "row",
                    }}
                    spacing={2}
                >

                    <Button

                        fullWidth

                        variant="outlined"

                        disabled={loading}

                        onClick={handleClose}

                    >

                        Annuler

                    </Button>

                    <Button

                        fullWidth

                        variant="contained"

                        disabled={
                            loading
                            ||
                            startDate === ""
                            ||
                            endDate === ""
                            ||
                            invalidDateRange
                        }

                        onClick={() => {

                            void handleSubmit();

                        }}

                    >

                        {
                            loading
                                ? "Création..."
                                : "Créer la fermeture"
                        }

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default VenueClosureDrawer;