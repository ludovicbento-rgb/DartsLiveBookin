import {
    Alert,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import AddIcon
    from "@mui/icons-material/Add";

import {
    useState,
} from "react";

import {
    AppLayout,
} from "@/app/layouts/AppLayout";

import {
    AppCard,
    PageTitle,
} from "@/shared/ui";

import {
    useAvailabilityRules,
} from "../hooks/useAvailabilityRules";

import AvailabilityRuleCard
    from "../components/AvailabilityRuleCard";

import AvailabilityRuleDrawer
    from "../components/AvailabilityRuleDrawer";

interface Props {

    venueId: string;

}

export function AvailabilityRulesPage({

    venueId,

}: Props) {

    const {

        rules,

        loading,

        error,

    } = useAvailabilityRules(

        venueId,

    );

    const [

        drawerOpen,

        setDrawerOpen,

    ] = useState(false);

    function closeDrawer() {

        setDrawerOpen(false);

    }

    return (

        <AppLayout>

            <AppCard>

                <Stack spacing={3}>

                    <Stack

                        direction="row"

                        sx={{

                            justifyContent: "space-between",

                            alignItems: "center",

                        }}

                    >

                        <PageTitle>

                            Règles de disponibilité

                        </PageTitle>

                        <Typography
                            color="text.secondary"
                        >

                            Configurez les événements qui rendent un établissement
                            indisponible de manière récurrente.

                        </Typography>

                        <Button

                            variant="contained"

                            startIcon={<AddIcon />}

                            onClick={() =>

                                setDrawerOpen(true)

                            }

                        >

                            Nouvelle règle

                        </Button>

                    </Stack>

                    {

                        loading && (

                            <CircularProgress />

                        )

                    }

                    {

                        error && (

                            <Alert severity="error">

                                {error}

                            </Alert>

                        )

                    }

                    {

                        !loading

                        &&

                        rules.length === 0

                        &&

                        (

                            <Alert severity="info">

                                Aucune règle de disponibilité n'a été créée.
                                Cliquez sur Nouvelle règle pour commencer.

                            </Alert>

                        )

                    }

                    {

                        rules.map(rule => (

                            <AvailabilityRuleCard

                                key={rule.id}

                                rule={rule}

                            />

                        ))

                    }

                </Stack>

            </AppCard>

            <AvailabilityRuleDrawer

                open={drawerOpen}

                onClose={closeDrawer}

            />

        </AppLayout>

    );

}

export default AvailabilityRulesPage;