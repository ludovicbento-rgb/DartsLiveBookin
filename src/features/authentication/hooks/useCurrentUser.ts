import { useEffect, useState } from "react";

import { useAuth } from "./useAuth";

import {
    getUserByFirebaseUid,
    type UserProfile,
} from "@/entities/user";

export function useCurrentUser() {

    const { user } = useAuth();

    const [profile, setProfile] =
        useState<UserProfile | null>(null);

    useEffect(() => {

        if (!user) {

            setProfile(null);

            return;

        }

        getUserByFirebaseUid(
            user.uid,
        ).then(setProfile);

    }, [user]);

    return profile;

}