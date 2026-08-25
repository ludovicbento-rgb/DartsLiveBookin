# DartsLive Bookin

# Spécifications Fonctionnelles

Version : 0.4.0-alpha

---

# Objet

Ce document décrit l'ensemble des fonctionnalités de l'application DartsLive Bookin.

Il constitue la référence fonctionnelle du projet.

---

# Périmètre

L'application permet de gérer les réservations des créneaux de jeu des établissements partenaires du Championnat de France Dartslive.

Elle couvre :

- l'authentification
- l'activation des comptes
- les réservations
- la validation des réservations
- l'administration

---

# Acteurs

## Joueur

Le joueur peut :

- se connecter
- activer son compte
- consulter les disponibilités
- réserver un créneau
- consulter ses réservations

---

## Gérant

Le gérant peut :

- consulter les demandes
- accepter une réservation
- refuser une réservation
- bloquer un créneau
- fermer un établissement

---

## Administrateur

L'administrateur peut :

- gérer les utilisateurs
- gérer les établissements
- gérer les saisons
- importer les joueurs
- importer les inscriptions

---

# Fonctionnalités

## US-001

Connexion

Description

Le joueur se connecte avec son adresse e-mail et son mot de passe.

Résultat attendu

Le Dashboard est affiché.

---

## US-002

Activation du compte

Le joueur saisit :

- son numéro de licence
- son adresse e-mail
- son mot de passe

Le système :

- vérifie la licence
- crée le compte Firebase
- associe le compte au joueur

---

## US-003

Dashboard

Le Dashboard affiche :

- le joueur connecté
- la saison active
- les inscriptions
- les établissements disponibles

Le joueur peut :

- choisir son inscription
- accéder au planning

---

## US-004

Planning

Le Planning affiche :

- les créneaux
- les cibles
- leur disponibilité

Les informations sont mises à jour en temps réel.

---

## US-005

Réservation

Le joueur sélectionne :

- un établissement
- un créneau
- une cible

Le système crée une réservation.

Le statut initial est :

PENDING

---

## US-006

Validation

Le gérant consulte les réservations.

Il peut :

- accepter
- refuser

Le joueur est immédiatement informé.

---

## US-007

Administration

Gestion :

- saisons
- établissements
- joueurs
- inscriptions
- paramètres

---

# Règles métier

Une cible ne peut pas être réservée deux fois sur le même créneau.

Une réservation possède toujours un statut.

Les statuts possibles sont :

- PENDING
- CONFIRMED
- REFUSED
- CANCELLED

Une réservation est toujours liée :

- à un joueur
- à une inscription
- à un établissement
- à une saison

---

# Parcours utilisateur

Connexion

↓

Dashboard

↓

Choix de l'inscription

↓

Choix du bar

↓

Planning

↓

Choix de la cible

↓

Confirmation

↓

Réservation

↓

Validation du gérant

↓

Historique

---

# Contraintes

Le projet doit fonctionner :

- sur ordinateur
- sur tablette
- sur smartphone

L'application est développée sous forme de Progressive Web App.

---

# Critères de qualité

Temps de réponse inférieur à 2 secondes.

Aucune double réservation.

Synchronisation en temps réel.

Architecture Feature-Sliced.

Firestore comme source unique des données.

---

# Hors périmètre V1

- Paiement
- Notifications Push
- Statistiques
- Classement
- Chat
- Géolocalisation