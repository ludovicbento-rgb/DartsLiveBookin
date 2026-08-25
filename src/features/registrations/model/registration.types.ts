export interface Registration {
    id: string;
    seasonId: string;

    competitionType:
    | "INDIVIDUAL"
    | "DOUBLES"
    | "TEAM";

    displayName: string;

    teamId?: string;
}