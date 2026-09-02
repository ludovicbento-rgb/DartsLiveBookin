import {
    MATCH_DURATION,
} from "@/shared/constants/match-duration";

import {
    CompetitionType,
} from "@/shared/constants/competition-types";

export function getMatchDurationMinutes(

    competitionType: CompetitionType,

): number {

    return MATCH_DURATION[
        competitionType
    ];

}