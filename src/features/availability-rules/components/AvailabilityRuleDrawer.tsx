import {
    Button,
    Drawer,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Card,
    CardContent,
    Alert,
} from "@mui/material";

import type {
    AvailabilityRule,
    AvailabilityRuleType,
} from "@/entities/availability-rule";

import {
    useEffect,
    useState,
} from "react";

interface Props {

    open: boolean;

    loading: boolean;

    rule: AvailabilityRule | null;

    onClose(): void;

    onCreate(
        form: AvailabilityRuleForm,
    ): Promise<void>;

    onUpdate(
        ruleId: string,
        form: AvailabilityRuleForm,
    ): Promise<void>;

}

const DAYS = [

    {
        value: 1,
        label: "Lun",
    },

    {
        value: 2,
        label: "Mar",
    },

    {
        value: 3,
        label: "Mer",
    },

    {
        value: 4,
        label: "Jeu",
    },

    {
        value: 5,
        label: "Ven",
    },

    {
        value: 6,
        label: "Sam",
    },

    {
        value: 0,
        label: "Dim",
    },

];

export interface AvailabilityRuleForm {

    title: string;

    description: string;

    type: "EVENT"
    | "MAINTENANCE"
    | "CLOSED";

    frequency: "WEEKLY";

    weekDays: number[];

    startTime: string;

    endTime: string;

    validFrom: string;

    validTo: string;

}

export function AvailabilityRuleDrawer({

    open,

    loading,

    rule,

    onClose,

    onCreate,

    onUpdate,

}: Props) {

    const [

        title,

        setTitle,

    ] = useState("");

    const editing =
        rule !== null;

    const [

        description,

        setDescription,

    ] = useState("");

    const [

        type,

        setType,

    ] = useState<AvailabilityRuleType>(

        "EVENT",

    );

    const [

        weekDays,

        setWeekDays,

    ] = useState<number[]>([]);

    const [

        startTime,

        setStartTime,

    ] = useState("20:00");

    const [

        endTime,

        setEndTime,

    ] = useState("00:00");

    function reset() {

        setTitle("");

        setDescription("");

        setType("EVENT");

        setWeekDays([]);

        setStartTime("20:00");

        setEndTime("00:00");

        setValidFrom("");

        setValidTo("");

    }

    function handleClose() {

        reset();

        onClose();

    }

    const [
        validFrom,
        setValidFrom,
    ] = useState("");

    const [
        validTo,
        setValidTo,
    ] = useState("");

    useEffect(() => {

        if (!open) {

            return;

        }

        if (!rule) {

            reset();

            return;

        }

        setTitle(
            rule.title,
        );

        setDescription(
            rule.description,
        );

        setType(
            rule.type,
        );

        setWeekDays(
            [...rule.weekDays],
        );

        setStartTime(
            rule.startTime,
        );

        setEndTime(
            rule.endTime,
        );

        setValidFrom(
            rule.validFrom,
        );

        setValidTo(
            rule.validTo,
        );

    }, [
        open,
        rule,
    ]);

    async function handleSubmit() {

        if (
            loading
            ||
            title.trim() === ""
            ||
            weekDays.length === 0
            ||
            validFrom === ""
            ||
            validTo === ""
            ||
            startTime === ""
            ||
            endTime === ""
            ||
            invalidDateRange
        ) {

            return;

        }

        const form: AvailabilityRuleForm = {

            title:
                title.trim(),

            description:
                description.trim(),

            type,

            frequency:
                "WEEKLY",

            weekDays,

            startTime,

            endTime,

            validFrom,

            validTo,

        };

        if (rule) {

            await onUpdate(
                rule.id,
                form,
            );

            return;

        }

        await onCreate(
            form,
        );

    }

    const invalidDateRange =

        validFrom !== ""

        &&

        validTo !== ""

        &&

        validFrom > validTo;
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
                    {
                        editing
                            ? "Modifier la règle de disponibilité"
                            : "Nouvelle règle de disponibilité"
                    }
                </Typography>

                <TextField

                    label="Nom"

                    value={title}

                    onChange={event =>

                        setTitle(

                            event.target.value,

                        )

                    }

                    fullWidth

                />

                <TextField

                    label="Message affiché aux joueurs"

                    value={description}

                    onChange={event =>

                        setDescription(

                            event.target.value,

                        )

                    }

                    multiline

                    minRows={3}

                    fullWidth

                />

                <FormControl fullWidth>

                    <InputLabel>

                        Type

                    </InputLabel>

                    <Select

                        value={type}

                        label="Type"

                        onChange={event =>

                            setType(

                                event.target.value,

                            )

                        }

                    >

                        <MenuItem value="EVENT">

                            Événement

                        </MenuItem>

                        <MenuItem value="MAINTENANCE">

                            Maintenance

                        </MenuItem>

                        <MenuItem value="CLOSED">

                            Fermeture

                        </MenuItem>

                    </Select>

                </FormControl>

                <Typography>

                    Jours concernés

                </Typography>

                <ToggleButtonGroup
                    value={weekDays}
                    onChange={(_, value) =>
                        setWeekDays(value)
                    }
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,

                        "& .MuiToggleButtonGroup-grouped": {
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            m: 0,
                        },
                    }}
                >

                    {

                        DAYS.map(day => (

                            <ToggleButton
                                key={day.value}
                                value={day.value}
                                sx={{
                                    flex: {
                                        xs: "1 0 22%",
                                        sm: "1 1 0",
                                    },
                                    minWidth: 0,
                                }}
                            >
                                {day.label}
                            </ToggleButton>

                        ))

                    }

                </ToggleButtonGroup>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                >

                    <TextField
                        label="Heure de début"
                        type="time"
                        value={startTime}
                        onChange={event =>
                            setStartTime(
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
                        label="Heure de fin"
                        type="time"
                        value={endTime}
                        onChange={event =>
                            setEndTime(
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

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                >

                    <TextField
                        label="Valide du"
                        type="date"
                        value={validFrom}
                        onChange={event =>
                            setValidFrom(
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
                        label="Valide jusqu'au"
                        type="date"
                        value={validTo}
                        onChange={event =>
                            setValidTo(
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

                <Stack

                    direction="row"

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
                            title.trim() === ""
                            ||
                            weekDays.length === 0
                            ||
                            validFrom === ""
                            ||
                            validTo === ""
                            ||
                            startTime === ""
                            ||
                            endTime === ""
                            ||
                            invalidDateRange
                        }
                        onClick={handleSubmit}
                    >
                        {
                            loading

                                ? (
                                    editing
                                        ? "Enregistrement..."
                                        : "Création..."
                                )

                                : (
                                    editing
                                        ? "Enregistrer les modifications"
                                        : "Créer la règle"
                                )
                        }
                    </Button>

                </Stack>

            </Stack>

            <Card
                variant="outlined"
            >

                <CardContent>

                    <Stack spacing={1}>

                        <Typography
                            variant="subtitle2"
                        >
                            Résumé
                        </Typography>

                        <Typography>

                            {title || "Sans titre"}

                        </Typography>

                        <Typography>

                            {

                                weekDays.length > 0

                                    ? weekDays
                                        .map(day => {

                                            const current = DAYS.find(

                                                item => item.value === day,

                                            );

                                            return current

                                                ? current.label

                                                : "";

                                        })

                                        .join(", ")

                                    : "Aucun jour"

                            }

                        </Typography>

                        <Typography>

                            {startTime}

                            {" → "}

                            {endTime}

                        </Typography>

                        <Typography
                            color="text.secondary"
                        >

                            Le planning sera automatiquement bloqué.

                        </Typography>

                    </Stack>

                </CardContent>

            </Card>

        </Drawer>



    );

}

export default AvailabilityRuleDrawer;