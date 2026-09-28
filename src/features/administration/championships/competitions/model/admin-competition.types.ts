import type {
    CompetitionType,
} from "@/entities/competition";

export interface AdminCompetitionRequest {

    seasonId: string;

    name: string;

    mode: CompetitionType;

    active: boolean;

}