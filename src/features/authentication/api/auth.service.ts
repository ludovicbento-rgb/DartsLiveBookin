import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import type { User } from "firebase/auth";

import { auth } from "@/shared/firebase";

import type {
    LoginRequest,
    RegisterRequest,
} from "../types/auth.types";

export class AuthService {
    async login(data: LoginRequest): Promise<User> {
        const credential = await signInWithEmailAndPassword(
            auth,
            data.email,
            data.password,
        );

        return credential.user;
    }

    async register(data: RegisterRequest): Promise<User> {
        const credential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password,
        );

        return credential.user;
    }

    async logout(): Promise<void> {
        await signOut(auth);
    }

    getCurrentUser(): User | null {
        return auth.currentUser;
    }
}

export const authService = new AuthService();