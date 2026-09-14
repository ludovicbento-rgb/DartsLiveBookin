import {
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import type {
    AvailabilityRule,
} from "@/entities/availability-rule";

interface Props {

    rule: AvailabilityRule;

}

export function AvailabilityRuleCard({

    rule,

}: Props) {

    return (

        <Card variant="outlined">

            <CardContent>

                <Stack spacing={1}>

                    <Typography
                        variant="h6"
                    >

                        {rule.title}

                    </Typography>

                    <Chip
                        label={rule.type}
                        size="small"
                    />

                    <Typography>

                        {rule.description}

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        {rule.startTime}

                        {" → "}

                        {rule.endTime}

                    </Typography>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default AvailabilityRuleCard;