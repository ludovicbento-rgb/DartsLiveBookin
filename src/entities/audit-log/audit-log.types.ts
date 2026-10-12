import type {
    Timestamp,
} from "firebase/firestore";

export type AuditAction =
    | "MAINTENANCE_ENABLED"
    | "MAINTENANCE_DISABLED"
    | "SETTINGS_UPDATED"
    | "IMPORT_V1_EXECUTED"
    | "IMPORT_V2_EXECUTED"
    | "MATCH_CREATED"
    | "MATCH_UPDATED"
    | "MATCH_PLAY_STATUS_CHANGED"
    | "USER_CREATED"
    | "USER_UPDATED"
    | "USER_STATUS_CHANGED";

export type AuditEntityType =
    | "SYSTEM"
    | "IMPORT"
    | "MATCH"
    | "USER";

export interface AuditLog {

    id: string;

    action:
    AuditAction;

    entityType:
    AuditEntityType;

    entityId:
    string | null;

    userId:
    string;

    userDisplayName:
    string;

    createdAt:
    Timestamp;

    metadata:
    Record<
        string,
        unknown
    >;

}

export interface CreateAuditLogRequest {

    action:
    AuditAction;

    entityType:
    AuditEntityType;

    entityId?:
    string | null;

    userId:
    string;

    userDisplayName:
    string;

    metadata?:
    Record<
        string,
        unknown
    >;

}