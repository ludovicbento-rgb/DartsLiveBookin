import type {
    SeasonImportV2PoolFile,
} from "../../import/model/season-import-v2.types";

export interface PoolExportStatistics {

    registrations: number;

    matchDays: number;

    matches: number;

    playedMatches: number;

    toPlayMatches: number;

}

export interface PreparedPoolExport {

    data:
    SeasonImportV2PoolFile;

    statistics:
    PoolExportStatistics;

}