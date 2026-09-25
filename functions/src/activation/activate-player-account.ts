import {
  getAuth,
} from "firebase-admin/auth";

import {
  getFirestore,
  FieldValue,
} from "firebase-admin/firestore";

import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

interface ActivationRequest {

    licenseNumber: string;

    email: string;

    password: string;

}

export const activatePlayerAccount =
    onCall<ActivationRequest>(

      async (request) => {
        const {
          licenseNumber,
          email,
          password,
        } = request.data;

        const normalizedLicenseNumber =
                licenseNumber?.trim();

        const normalizedEmail =
                email?.trim().toLowerCase();

        /*
             * Validation minimale côté serveur.
             *
             * Il ne faut jamais faire confiance
             * uniquement à la validation React.
             */
        if (!normalizedLicenseNumber) {
          throw new HttpsError(
            "invalid-argument",
            "LICENSE_REQUIRED",
          );
        }

        if (!normalizedEmail) {
          throw new HttpsError(
            "invalid-argument",
            "EMAIL_REQUIRED",
          );
        }

        if (
          !password ||
                password.length < 8
        ) {
          throw new HttpsError(
            "invalid-argument",
            "PASSWORD_INVALID",
          );
        }

        const db =
                getFirestore();

        /*
             * Recherche du joueur préchargé.
             *
             * Admin SDK :
             * les Firestore Security Rules
             * ne bloquent pas cette requête.
             */
        const snapshot =
                await db
                  .collection("users")
                  .where(
                    "licenseNumber",
                    "==",
                    normalizedLicenseNumber,
                  )
                  .limit(1)
                  .get();

        if (snapshot.empty) {
          throw new HttpsError(
            "not-found",
            "LICENSE_NOT_FOUND",
          );
        }

        const playerDocument =
                snapshot.docs[0];

        const player =
                playerDocument.data();

        if (
          player.accountActivated === true
        ) {
          throw new HttpsError(
            "already-exists",
            "ACCOUNT_ALREADY_ACTIVATED",
          );
        }

        if (
          player.status !== "ACTIVE"
        ) {
          throw new HttpsError(
            "failed-precondition",
            "ACCOUNT_BLOCKED",
          );
        }

        /*
             * Vérifier explicitement que
             * l'adresse n'existe pas déjà.
             */
        try {
          await getAuth()
            .getUserByEmail(
              normalizedEmail,
            );

          throw new HttpsError(
            "already-exists",
            "EMAIL_EXISTS",
          );
        } catch (error) {
          /*
                 * user-not-found est le seul
                 * résultat normal ici.
                 */
          if (
            error instanceof
                    HttpsError
          ) {
            throw error;
          }

          const firebaseError =
                    error as {
                        code?: string;
                    };

          if (
            firebaseError.code !==
                    "auth/user-not-found"
          ) {
            throw error;
          }
        }

        /*
             * Création Firebase Authentication
             * côté serveur.
             *
             * Contrairement au SDK Web,
             * cela ne connecte pas le navigateur.
             */
        const firebaseUser =
                await getAuth()
                  .createUser({

                    email:
                            normalizedEmail,

                    password,

                    disabled: false,

                  });

        try {
          /*
                 * Association du compte Firebase
                 * avec le joueur préchargé.
                 */
          await playerDocument.ref.update({

            firebaseUid:
                        firebaseUser.uid,

            email:
                        normalizedEmail,

            accountActivated:
                        true,

            lastLoginAt:
                        FieldValue.serverTimestamp(),

            updatedAt:
                        FieldValue.serverTimestamp(),

          });
        } catch (error) {
          /*
                 * Rollback important :
                 *
                 * si Firestore échoue après
                 * création du compte Auth,
                 * on supprime le compte Auth
                 * afin d'éviter un compte
                 * orphelin.
                 */
          try {
            await getAuth()
              .deleteUser(
                firebaseUser.uid,
              );
          } catch (rollbackError) {
            console.error(
              "ACTIVATION_ROLLBACK_FAILED",
              rollbackError,
            );
          }

          console.error(
            "ACTIVATION_FIRESTORE_UPDATE_FAILED",
            error,
          );

          throw new HttpsError(
            "internal",
            "ACTIVATION_FAILED",
          );
        }

        return {

          success: true,

        };
      },

    );
