import {
    CompetitionType,
} from "./competition-types";

export const MATCH_DURATION = {

    [CompetitionType.INDIVIDUAL]: 45,

    [CompetitionType.DOUBLES]: 90,

    [CompetitionType.TEAM]: 150,

} as const;