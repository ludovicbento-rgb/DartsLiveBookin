import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";

import { AppLayout } from "@/app/layouts/AppLayout";
import {
    AppCard,
    PageTitle,
} from "@/shared/ui";

import {
    planningMatchRoute,
} from "@/shared/routing";

import { useAuth } from "@/features/authentication/hooks/useAuth";

import { useMyMatches } from "../hooks/useMyMatches";

import type {
    MyMatch,
} from "../model/my-match";
import { MatchPager } from "../components/MatchPager/MatchPager";

export function MyMatchesPage() {

    const navigate =
        useNavigate();

    const {

        userProfile,

    } = useAuth();
    console.log("MyMatchesPage - userProfile", userProfile);

    console.log("PlayerId envoyé", userProfile?.playerId);

    const {

        matches,

        loading,

    } = useMyMatches(

        userProfile?.playerId,

    );



    function handlePlan(
        match: MyMatch,
    ) {

        navigate(

            planningMatchRoute(

                match.venueId,

                match.matchId,

            ),

        );

    }

    if (loading) {

        return (

            <AppLayout>

                <AppCard>

                    <Stack spacing={2}>

                        <CircularProgress />

                        <Typography>

                            Chargement...

                        </Typography>

                    </Stack>

                </AppCard>

            </AppLayout>

        );

    }

    return (

        <AppLayout>

            <AppCard>

                <Stack spacing={3}>

                    <PageTitle>

                        Mes matchs

                    </PageTitle>

                    {

                        matches.length === 0 && (

                            <Alert severity="info">

                                Aucun match à afficher.

                            </Alert>

                        )

                    }

                    {
                        matches.length > 0 && (
                            <MatchPager
                                matches={matches}
                                onPlan={handlePlan}
                            />
                        )
                    }

                </Stack>

            </AppCard>

        </AppLayout>

    );

}

export default MyMatchesPage;   