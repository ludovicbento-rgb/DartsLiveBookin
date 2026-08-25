import { useEffect, useState } from "react";

import type { DashboardData } from "../model/dashboard.types";

import { getVenues } from "@/entities/venue";

export function useDashboard() {

    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);

    useEffect(() => {

        async function load() {

            const venues =
                await getVenues();

            setDashboard({

                firstname: "Ludovic",

                season: "CF2027",

                competition: "Doublette",

                venues,

            });

        }

        load();

    }, []);

    return dashboard;

}