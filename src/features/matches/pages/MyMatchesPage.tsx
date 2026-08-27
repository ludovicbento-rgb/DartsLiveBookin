import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { useNavigate } from "react-router-dom";

import { AppLayout } from "@/app/layouts/AppLayout";
import {
    AppCard,
    PageTitle,
} from "@/shared/ui";

import { useAuth } from "@/features/authentication/hooks/useAuth";

import { useMyMatches } from "../hooks/useMyMatches";

export function MyMatchesPage() {

    const navigate =
        useNavigate();

    const { user } =
        useAuth();

    const {

        matches,

        loading,

    } =
        useMyMatches(
            user?.uid,
        );

    if (loading) {

        return (

            <AppLayout>

                <AppCard>

                    <Stack
                        sx={{
                            alignItems: "center",
                        }}
                        spacing={2}
                    >

                        <CircularProgress />

                        <Typography>

                            Chargement
                            des matchs...

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

                        matches.map(match => (

                            <AppCard
                                key={match.matchId}
                            >

                                <Stack spacing={2}>

                                    <Typography
                                        variant="h6"
                                    >

                                        {match.matchDay}

                                    </Typography>

                                    <Typography>

                                        {match.homeTeam}

                                    </Typography>

                                    <Typography
                                        align="center"
                                    >

                                        VS

                                    </Typography>

                                    <Typography>

                                        {match.awayTeam}

                                    </Typography>

                                    <Typography
                                        variant="body2"
                                    >

                                        {match.venueName}

                                    </Typography>

                                    {

                                        match.plannedStartAt && (

                                            <Typography
                                                variant="body2"
                                            >

                                                {

                                                    match.plannedStartAt
                                                        .toDate()
                                                        .toLocaleString(
                                                            "fr-FR",
                                                        )

                                                }

                                            </Typography>

                                        )

                                    }

                                    {

                                        match.boardNumber && (

                                            <Typography
                                                variant="body2"
                                            >

                                                Cible {match.boardNumber}

                                            </Typography>

                                        )

                                    }

                                    <Button

                                        variant="contained"

                                        disabled={
                                            match.status !==
                                            "NOT_PLANNED"
                                        }

                                        onClick={() =>

                                            navigate(

                                                `/planning?matchId=${match.matchId}`,

                                            )

                                        }

                                    >

                                        {

                                            match.status ===
                                                "NOT_PLANNED"

                                                ? "Planifier"

                                                : "Voir"

                                        }

                                    </Button>

                                </Stack>

                            </AppCard>

                        ))

                    }

                </Stack>

            </AppCard>

        </AppLayout>

    );

}

export default MyMatchesPage;