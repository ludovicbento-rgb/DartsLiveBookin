import { useEffect, useState } from "react";

import { useAuth } from "./useAuth";

import {
    getUserByUid,
    type UserProfile,
} from "@/entities/user";

export function useCurrentUser() {
    const { user } = useAuth();

    const [profile, setProfile] =
        useState<UserProfile | null>(null);

    useEffect(() => {

        if (!user) {
            return;
        }

        getUserByUid(user.uid)
            .then(setProfile);

    }, [user]);

    return profile;
}