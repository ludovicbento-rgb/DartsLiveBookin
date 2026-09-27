import type {
    CompetitionMode,
} from "@/entities/competition";

export interface AdminCompetitionRequest {

    seasonId: string;

    name: string;

    mode: CompetitionMode;

    active: boolean;

}