import { createContext } from "react";

import type {
    UserProfile,
} from "@/entities/user";

export interface UserProfileContextType {

    profile: UserProfile | null;

    loading: boolean;

}

export const UserProfileContext =
    createContext<UserProfileContextType>({
        profile: null,
        loading: true,
    });