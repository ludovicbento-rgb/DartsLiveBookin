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
    AvailabilityRule,
} from "@/entities/availability-rule";

import DeleteIcon
    from "@mui/icons-material/Delete";

interface Props {

    rule: AvailabilityRule;

    loading?: boolean;

    onEdit(
        rule: AvailabilityRule,
    ): void;

    onActiveChanged(
        rule: AvailabilityRule,
        active: boolean,
    ): Promise<void>;

    onDelete(
        rule: AvailabilityRule,
    ): void;

}

const DAY_LABELS: Record<number, string> = {

    0: "Dim",
    1: "Lun",
    2: "Mar",
    3: "Mer",
    4: "Jeu",
    5: "Ven",
    6: "Sam",

};

function getTypeLabel(
    type: AvailabilityRule["type"],
): string {

    switch (type) {

        case "EVENT":
            return "Championnat";

        case "MAINTENANCE":
            return "Maintenance";

        case "CLOSED":
            return "Fermeture";

        default:
            return type;

    }

}

function getTypeIcon(
    type: AvailabilityRule["type"],
): string {

    switch (type) {

        case "EVENT":
            return "🏆";

        case "MAINTENANCE":
            return "🔧";

        case "CLOSED":
            return "🔒";

        default:
            return "📌";

    }

}

function formatDate(
    value: string,
): string {

    const [
        year,
        month,
        day,
    ] = value.split("-");

    if (
        !year
        ||
        !month
        ||
        !day
    ) {

        return value;

    }

    return `${day}/${month}/${year}`;

}

export function AvailabilityRuleCard({

    rule,

    loading = false,

    onEdit,

    onActiveChanged,

    onDelete,

}: Props) {

    const days =

        rule.weekDays

            .map(day =>
                DAY_LABELS[day],
            )

            .filter(Boolean)

            .join(", ");

    return (

        <Card variant="outlined">

            <CardContent>

                <Stack spacing={1.5}>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        {getTypeIcon(rule.type)}
                        {" "}
                        {rule.title}
                    </Typography>

                    <Chip
                        label={getTypeLabel(rule.type)}
                        size="small"
                        sx={{
                            alignSelf: "flex-start",
                        }}
                    />

                    <Typography variant="body2">

                        📅 {days || "Aucun jour"}

                    </Typography>

                    <Typography variant="body2">

                        🕒 {rule.startTime}
                        {" → "}
                        {rule.endTime}

                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        📆 Du {formatDate(rule.validFrom)}
                        {" au "}
                        {formatDate(rule.validTo)}
                    </Typography>

                    {
                        rule.description && (

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {rule.description}
                            </Typography>

                        )
                    }

                </Stack>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={1}
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
                                checked={rule.isActive}
                                disabled={loading}
                                onChange={(_, checked) => {

                                    void onActiveChanged(
                                        rule,
                                        checked,
                                    );

                                }}
                            />
                        }
                        label={
                            rule.isActive
                                ? "Actif"
                                : "Inactif"
                        }
                    />

                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        disabled={loading}
                        onClick={() =>
                            onEdit(rule)
                        }
                    >
                        Modifier
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        disabled={loading}
                        onClick={() =>
                            onDelete(rule)
                        }
                    >
                        Supprimer
                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default AvailabilityRuleCard;    