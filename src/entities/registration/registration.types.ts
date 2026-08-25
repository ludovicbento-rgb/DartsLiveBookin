export interface Registration {
    id: string;

    playerUid: string;

    seasonId: string;

    competitionType:
    | "INDIVIDUAL"
    | "DOUBLES"
    | "TEAM";

    displayName: string;

    teamId?: string;

    active: boolean;
}