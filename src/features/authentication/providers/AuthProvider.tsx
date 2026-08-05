import {
    onAuthStateChanged,
} from "firebase/auth";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type { ReactNode } from "react";
import type { User } from "firebase/auth";

import { auth } from "@/shared/firebase";

import { authService } from "../api/auth.service";
import { AuthContext } from "../context/AuthContext";

interface Props {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: Props) {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);

            setLoading(false);
        });
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,

            async login(
                email: string,
                password: string,
            ) {
                await authService.login({
                    email,
                    password,
                });
            },

            async register(
                email: string,
                password: string,
            ) {
                await authService.register({
                    email,
                    password,
                });
            },

            async logout() {
                await authService.logout();
            },
        }),
        [loading, user],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
