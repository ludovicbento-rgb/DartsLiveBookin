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
} from "@mui/material";

import type {
    AvailabilityRuleType,
} from "@/entities/availability-rule";

import {
    useState,
} from "react";

interface Props {

    open: boolean;

    loading: boolean;

    onClose(): void;

    onCreate(
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

    validFrom: Date;

    validTo: Date;

}

export function AvailabilityRuleDrawer({

    open,

    onClose,

    onCreate,

}: Props) {

    const [

        title,

        setTitle,

    ] = useState("");

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

    }

    function handleClose() {

        reset();

        onClose();

    }

    const [validFrom] = useState(new Date());
    const [validTo] = useState(new Date());


    return (

        <Drawer

            anchor="right"

            open={open}

            onClose={handleClose}

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

                    Nouvelle règle de disponibilité

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

                >

                    {

                        DAYS.map(day => (

                            <ToggleButton

                                key={day.value}

                                value={day.value}

                            >

                                {day.label}

                            </ToggleButton>

                        ))

                    }

                </ToggleButtonGroup>

                <Stack

                    direction="row"

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

                        fullWidth

                        slotProps={{

                            inputLabel: {

                                shrink: true,

                            },

                        }}


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
                    <TextField

                        label="Valide du"

                        type="date"

                        value={""}

                    />
                    <TextField

                        label="Valide jusqu'au"

                        type="date"

                        value={""}

                    />

                </Stack>

                <Stack

                    direction="row"

                    spacing={2}

                >

                    <Button

                        fullWidth

                        variant="outlined"

                        onClick={handleClose}

                    >

                        Annuler

                    </Button>

                    <Button

                        disabled={

                            title.trim() === ""

                            ||

                            weekDays.length === 0

                        }

                        onClick={async () => {

                            await onCreate({

                                title,

                                description,

                                type,

                                frequency: "WEEKLY",

                                weekDays,

                                startTime,

                                endTime,

                                validFrom,

                                validTo,

                            });

                            reset();

                        }}

                    >

                        Créer la règle

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