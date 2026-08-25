# DartsLive Bookin

# Product Backlog

Version : 0.4.0-alpha

---

# Objectif

Ce document décrit l'ensemble des User Stories du projet.

Il constitue la référence du Product Owner.

Chaque User Story possède :

- une priorité
- une estimation
- un état
- un sprint cible

---

# Etats

🔴 Non démarrée

🟡 En cours

🟢 Terminée

⚫ Abandonnée

---

# Priorités

P1

Critique

P2

Haute

P3

Normale

P4

Faible

---

# Sprint 1

## US-001

Connexion Firebase

Priorité

P1

Story Points

5

Etat

🟢

Description

Authentifier un joueur avec Firebase Authentication.

Critères d'acceptation

- Connexion
- Déconnexion
- Session persistante

---

# Sprint 2

## US-002

Activation du compte

Priorité

P1

Story Points

8

Etat

🔴

Description

Associer une licence Dartslive à un compte Firebase.

Critères

- Recherche licence
- Création Firebase
- Mise à jour Firestore
- Connexion automatique

---

## US-003

Dashboard

Priorité

P1

Story Points

5

Etat

🟡

Description

Afficher les établissements disponibles.

Critères

- Joueur connecté
- Saison
- Inscriptions
- Navigation

---

# Sprint 3

## US-004

Planning

Priorité

P1

Story Points

13

Etat

🟡

Description

Afficher les créneaux disponibles.

Critères

- Disponibilités
- Temps réel
- Navigation

---

## US-005

Réservation

Priorité

P1

Story Points

13

Etat

🔴

Description

Créer une réservation.

Critères

- Transaction Firestore
- Création
- Rafraîchissement
- Notification

---

# Sprint 4

## US-006

Validation

Priorité

P2

Story Points

8

Etat

🔴

Description

Permettre au gérant de valider une réservation.

Critères

- Liste des demandes
- Validation
- Refus

---

# Sprint 5

## US-007

Administration

Priorité

P2

Story Points

21

Etat

🔴

Description

Administration complète.

Critères

- Joueurs
- Etablissements
- Saisons
- Inscriptions

---

## US-008

Configuration

Priorité

P3

Story Points

5

Etat

🔴

Description

Paramètres système.

Critères

- Saison active
- Créneaux
- Durée réservation

---

# Améliorations

## UX

P3

- Responsive
- Snackbar
- Animations

---

## Technique

P3

- Tests unitaires
- Tests Firestore
- CI/CD

---

## Futur

P4

- Notifications Push
- Statistiques
- Mode sombre
- Classement
- Export Excel