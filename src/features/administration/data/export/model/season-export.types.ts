export interface SeasonExportTimestamp {

    seconds: number;

    nanoseconds: number;

}

export interface SeasonExportSeason {

    id: string;

    name: string;

    active: boolean;

    createdAt?: SeasonExportTimestamp;

    updatedAt?: SeasonExportTimestamp;

}

export interface SeasonExportCompetition {

    id: string;

    seasonId: string;

    name: string;

    type:
    | "INDIVIDUAL"
    | "DOUBLES"
    | "TEAM";

    active: boolean;

    matchDurationMinutes?:
    | number
    | string;

    createdAt?: SeasonExportTimestamp;

    updatedAt?: SeasonExportTimestamp;

}

export interface SeasonExportPool {

    id: string;

    competitionId: string;

    name: string;

    order: number;

    active: boolean;

    createdAt?: SeasonExportTimestamp;

    updatedAt?: SeasonExportTimestamp;

}

export interface SeasonExportRegistration {

    id: string;

    seasonId: string;

    competitionId: string;

    poolId: string;

    registrationName: string;

    captainId: string;

    playerIds: string[];

    homeVenueId: string;

    active: boolean;

    createdAt?: SeasonExportTimestamp;

    updatedAt?: SeasonExportTimestamp;

}

export interface SeasonExportMatchDay {

    id: string;

    seasonId: string;

    competitionId: string;

    poolId: string;

    number: number;

    displayName: string;

    officialDate:
    SeasonExportTimestamp;

    active: boolean;

    createdAt?: SeasonExportTimestamp;

    updatedAt?: SeasonExportTimestamp;

}

export interface SeasonExportMatch {

    id: string;

    matchDayId: string;

    homeRegistrationId: string;

    awayRegistrationId: string;

    status:
    | "NOT_PLANNED"
    | "PENDING"
    | "PLANNED";

    playStatus:
    | "TO_PLAY"
    | "PLAYED";

    plannedReservationId:
    string | null;

    createdAt?: SeasonExportTimestamp;

    updatedAt?: SeasonExportTimestamp;

}

export interface SeasonExportFile {

    schemaVersion: 1;

    exportedAt: string;

    season:
    SeasonExportSeason;

    competitions:
    SeasonExportCompetition[];

    pools:
    SeasonExportPool[];

    registrations:
    SeasonExportRegistration[];

    matchDays:
    SeasonExportMatchDay[];

    matches:
    SeasonExportMatch[];

}