import {
    addDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

import {
    auditLogsCollection,
} from "./audit-log.firestore";

import type {
    AuditLog,
} from "./audit-log.types";

import type {
    CreateAuditLogRequest,
} from "./audit-log.types";

export async function safeCreateAuditLog(
    request: CreateAuditLogRequest,
): Promise<void> {

    try {

        await createAuditLog(
            request,
        );

    }
    catch (error) {

        /*
         * L'audit est une fonction de traçabilité.
         *
         * Une erreur d'audit ne doit jamais transformer
         * une opération métier déjà réussie en erreur
         * fonctionnelle pour l'utilisateur.
         */

        console.error(
            "AUDIT_LOG_CREATION_FAILED",
            {
                request,
                error,
            },
        );

    }

}

export async function getAuditLogs(
    maxResults = 200,
): Promise<AuditLog[]> {

    const auditQuery =
        query(
            auditLogsCollection,
            orderBy(
                "createdAt",
                "desc",
            ),
            limit(
                maxResults,
            ),
        );

    const snapshot =
        await getDocs(
            auditQuery,
        );

    return snapshot.docs.map(
        document => {

            const data =
                document.data();

            return {

                id:
                    document.id,

                action:
                    data.action,

                entityType:
                    data.entityType,

                entityId:
                    data.entityId
                    ??
                    null,

                userId:
                    data.userId,

                userDisplayName:
                    data.userDisplayName,

                createdAt:
                    data.createdAt,

                metadata:
                    data.metadata
                    ??
                    {},

            } as AuditLog;

        },
    );

}

export async function createAuditLog(
    request: CreateAuditLogRequest,
): Promise<void> {

    console.log(
        "AUDIT_BEFORE_ADD_DOC",
        request,
    );

    try {

        const documentReference =
            await addDoc(
                auditLogsCollection,
                {
                    action:
                        request.action,

                    entityType:
                        request.entityType,

                    entityId:
                        request.entityId
                        ??
                        null,

                    userId:
                        request.userId,

                    userDisplayName:
                        request.userDisplayName,

                    metadata:
                        request.metadata
                        ??
                        {},

                    createdAt:
                        serverTimestamp(),
                },
            );

        console.log(
            "AUDIT_ADD_DOC_SUCCESS",
            {
                id:
                    documentReference.id,

                path:
                    documentReference.path,
            },
        );

    }
    catch (error) {

        console.error(
            "AUDIT_ADD_DOC_ERROR",
            error,
        );

        throw error;

    }

}