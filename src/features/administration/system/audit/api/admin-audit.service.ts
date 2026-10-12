import {
    getAuditLogs,
} from "@/entities/audit-log";

import type {
    AuditLog,
} from "@/entities/audit-log";

export async function loadAdminAuditLogs():
    Promise<AuditLog[]> {

    return getAuditLogs(
        200,
    );

}