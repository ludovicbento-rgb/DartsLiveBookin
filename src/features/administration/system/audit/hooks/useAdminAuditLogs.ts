import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    AuditLog,
} from "@/entities/audit-log";

import {
    loadAdminAuditLogs,
} from "../api/admin-audit.service";

export function useAdminAuditLogs() {

    const [
        logs,
        setLogs,
    ] =
        useState<AuditLog[]>(
            [],
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );

    const reload =
        useCallback(
            async () => {

                try {

                    setLoading(
                        true,
                    );

                    setError(
                        null,
                    );

                    const result =
                        await loadAdminAuditLogs();

                    setLogs(
                        result,
                    );

                }
                catch (error) {

                    console.error(
                        "ADMIN_AUDIT_LOAD_FAILED",
                        error,
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "ADMIN_AUDIT_LOAD_FAILED",
                    );

                }
                finally {

                    setLoading(
                        false,
                    );

                }

            },
            [],
        );

    useEffect(() => {

        void reload();

    }, [
        reload,
    ]);

    return {

        logs,

        loading,

        error,

        reload,

    };

}