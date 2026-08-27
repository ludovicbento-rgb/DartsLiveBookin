import {
    getMatch,
    type Match,
} from "@/entities/match";

import {
    getMatchDay,
    type MatchDay,
} from "@/entities/matchday";

import {
    getRegistration,
    type Registration,
} from "@/entities/registration";

import {
    getVenue,
    type Venue,
} from "@/entities/venue";

export interface MatchPlanningContext {

    match: Match;

    matchDay: MatchDay;

    homeRegistration: Registration;

    awayRegistration: Registration;

    venue: Venue;

}

export async function getMatchPlanningContext(
    matchId: string,
): Promise<MatchPlanningContext> {

    const match =
        await getMatch(matchId);

    if (!match) {

        throw new Error(
            "MATCH_NOT_FOUND",
        );

    }

    const matchDay =
        await getMatchDay(
            match.matchDayId,
        );

    if (!matchDay) {

        throw new Error(
            "MATCHDAY_NOT_FOUND",
        );

    }

    const homeRegistration =
        await getRegistration(
            match.homeRegistrationId,
        );

    if (!homeRegistration) {

        throw new Error(
            "HOME_REGISTRATION_NOT_FOUND",
        );

    }

    const awayRegistration =
        await getRegistration(
            match.awayRegistrationId,
        );

    if (!awayRegistration) {

        throw new Error(
            "AWAY_REGISTRATION_NOT_FOUND",
        );

    }

    const venue =
        await getVenue(
            homeRegistration.homeVenueId,
        );

    if (!venue) {

        throw new Error(
            "VENUE_NOT_FOUND",
        );

    }

    return {

        match,

        matchDay,

        homeRegistration,

        awayRegistration,

        venue,

    };

}