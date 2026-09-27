import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    loadAdminUsers,
} from "../api/admin-users.service";

import type {
    AdminUserListItem,
} from "../model/admin-user.types";

export function useAdminUsers() {

    const [
        users,
        setUsers,
    ] = useState<
        AdminUserListItem[]
    >([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    );

    const load =
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
                        await loadAdminUsers();

                    setUsers(
                        result,
                    );

                }
                catch (error) {

                    console.error(
                        "ADMIN_USERS_LOAD_FAILED",
                        error,
                    );

                    setError(

                        error instanceof Error
                            ? error.message
                            : "Impossible de charger les utilisateurs.",

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

        void load();

    }, [
        load,
    ]);

    return {

        users,

        loading,

        error,

        reload:
            load,

    };

}