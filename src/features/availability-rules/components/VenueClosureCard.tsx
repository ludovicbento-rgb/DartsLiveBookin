import {
    Button,
    Card,
    CardContent,
    Chip,
    FormControlLabel,
    Stack,
    Switch,
    Typography,
} from "@mui/material";

import EditIcon
    from "@mui/icons-material/Edit";

import type {
    VenueClosure,
    VenueClosureReason,
} from "@/entities/venue-closure";

import DeleteIcon
    from "@mui/icons-material/Delete";

interface Props {

    closure: VenueClosure;

    loading?: boolean;

    onEdit(
        closure: VenueClosure,
    ): void;

    onActiveChanged(
        closure: VenueClosure,
        active: boolean,
    ): Promise<void>;

    onDelete(
        closure: VenueClosure,
    ): void;

}

function getReasonLabel(
    reason: VenueClosureReason,
): string {

    switch (reason) {

        case "VACATION":
            return "Vacances";

        case "PRIVATE_EVENT":
            return "Privatisation";

        case "MAINTENANCE":
            return "Maintenance";

        case "INVENTORY":
            return "Inventaire";

        case "OTHER":
            return "Fermeture exceptionnelle";

    }

}

function getReasonIcon(
    reason: VenueClosureReason,
): string {

    switch (reason) {

        case "VACATION":
            return "🏖️";

        case "PRIVATE_EVENT":
            return "🎉";

        case "MAINTENANCE":
            return "🔧";

        case "INVENTORY":
            return "📦";

        case "OTHER":
            return "🔒";

    }

}

function formatDate(
    date: Date,
): string {

    return date.toLocaleDateString(
        "fr-FR",
    );

}

export function VenueClosureCard({

    closure,

    loading = false,

    onEdit,

    onActiveChanged,

    onDelete,

}: Props) {

    const startDate =
        closure.startDate.toDate();

    const endDate =
        closure.endDate.toDate();

    return (

        <Card variant="outlined">

            <CardContent>

                <Stack spacing={1.5}>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            justifyContent:
                                "space-between",
                            alignItems:
                                "flex-start",
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            {getReasonIcon(
                                closure.reasonType,
                            )}

                            {" "}

                            {getReasonLabel(
                                closure.reasonType,
                            )}

                        </Typography>

                        <Chip
                            size="small"
                            color={
                                closure.active
                                    ? "success"
                                    : "default"
                            }
                            label={
                                closure.active
                                    ? "Actif"
                                    : "Inactif"
                            }
                        />

                    </Stack>

                    <Typography
                        variant="body2"
                    >

                        📆 Du {formatDate(startDate)}
                        {" au "}
                        {formatDate(endDate)}

                    </Typography>

                    {
                        closure.comment && (

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >

                                {closure.comment}

                            </Typography>

                        )
                    }

                </Stack>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "stretch",
                            sm: "center",
                        },
                        pt: 1,
                    }}
                >

                    <FormControlLabel
                        control={
                            <Switch
                                checked={closure.active}
                                disabled={loading}
                                onChange={(_, checked) => {

                                    void onActiveChanged(
                                        closure,
                                        checked,
                                    );

                                }}
                            />
                        }
                        label={
                            closure.active
                                ? "Actif"
                                : "Inactif"
                        }
                    />

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={1}
                    >

                        <Button
                            variant="outlined"
                            startIcon={
                                <EditIcon />
                            }
                            disabled={loading}
                            onClick={() =>
                                onEdit(closure)
                            }
                        >
                            Modifier
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={
                                <DeleteIcon />
                            }
                            disabled={loading}
                            onClick={() =>
                                onDelete(closure)
                            }
                        >
                            Supprimer
                        </Button>

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default VenueClosureCard;