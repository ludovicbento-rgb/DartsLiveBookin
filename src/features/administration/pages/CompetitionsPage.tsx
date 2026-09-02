import Typography from "@mui/material/Typography";

import { AppLayout } from "@/app/layouts/AppLayout";

import {
    AppCard,
    PageTitle,
} from "@/shared/ui";

export function CompetitionsPage() {

    return (

        <AppLayout>

            <AppCard>

                <PageTitle>

                    Compétitions

                </PageTitle>

                <Typography>

                    🚧 En cours de développement

                </Typography>

            </AppCard>

        </AppLayout>

    );

}

export default CompetitionsPage;