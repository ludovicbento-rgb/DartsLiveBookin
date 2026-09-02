export const CompetitionType = {

    INDIVIDUAL: "INDIVIDUAL",

    DOUBLES: "DOUBLES",

    TEAM: "TEAM",

} as const;

export type CompetitionType =
    typeof CompetitionType[keyof typeof CompetitionType];