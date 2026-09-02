import { createContext } from "react";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/entities/user";

export interface AuthContextType {
    firebaseUser: User | null;

    userProfile: UserProfile | null;
    loading: boolean;

    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);