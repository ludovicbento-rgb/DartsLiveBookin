export function firebaseError(code: string): string {

    switch (code) {

        case "auth/invalid-credential":
            return "Email ou mot de passe incorrect.";

        case "auth/user-disabled":
            return "Ce compte est désactivé.";

        case "auth/network-request-failed":
            return "Connexion impossible.";

        default:
            return "Une erreur est survenue.";
    }

}