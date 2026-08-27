import {
    getMatchPlanningContext,
} from "@/features/commands/match-planning.service";

import {
    getMatchesToPlanByRegistration,
} from "@/entities/match";

import type {
    MatchListItem,
} from "../model/match-list-item";

export async function loadMatchesToPlan(
    registrationId: string,
): Promise<MatchListItem[]> {

    const matches =
        await getMatchesToPlanByRegistration(
            registrationId,
        )

    const items: MatchListItem[] = [];

    for (const match of matches) {

        const context =
            await getMatchPlanningContext(
                match.id,
            );

        items.push({

            id: match.id,

            label:
                `${context.matchDay.displayName} - ${context.homeRegistration.registrationName} vs ${context.awayRegistration.registrationName}`,

        });

    }

    return items;

}