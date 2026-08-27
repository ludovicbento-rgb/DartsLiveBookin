import {
    getMatch,
} from "@/entities/match";

import {
    getMatchDay,
} from "@/entities/matchday";

import {
    getRegistration,
} from "@/entities/registration";

import {
    getVenue,
} from "@/entities/venue";

import type { Match } from "@/entities/match";
import type { MatchDay } from "@/entities/matchday";
import type { Registration } from "@/entities/registration";
import type { Venue } from "@/entities/venue";

export interface MatchContext {

    match: Match;

    matchDay: MatchDay;

    homeRegistration: Registration;

    awayRegistration: Registration;

    venue: Venue;

}

export async function getMatchContext(
    matchId: string,
): Promise<MatchContext> {

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