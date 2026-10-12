export type ImportFileVersion =
    | 1
    | 2;

export interface ImportFileHeader {

    schemaVersion:
    ImportFileVersion;

    scope?:
    "POOL"
    | "MATCHES";

}

export function detectImportFileVersion(
    value: unknown,
): ImportFileHeader {

    if (
        !value
        ||
        typeof value !== "object"
    ) {

        throw new Error(
            "IMPORT_JSON_INVALID",
        );

    }

    const data =
        value as Record<
            string,
            unknown
        >;

    if (
        data.schemaVersion === 1
    ) {

        return {
            schemaVersion: 1,
        };

    }

    if (
        data.schemaVersion === 2
    ) {

        if (
            data.scope !== "POOL"
            &&
            data.scope !== "MATCHES"
        ) {

            throw new Error(
                "IMPORT_V2_SCOPE_INVALID",
            );

        }

        return {

            schemaVersion: 2,

            scope:
                data.scope,

        };

    }

    throw new Error(
        "IMPORT_SCHEMA_UNSUPPORTED",
    );

}