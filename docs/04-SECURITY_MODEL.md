# DartsLive Bookin

# Security Model

Version : 0.4.0-alpha

---

# Objectif

Ce document décrit le modèle de sécurité de DartsLive Bookin.

Il définit :

- les rôles
- les permissions
- les règles Firestore
- les droits d'accès

Ce document constitue la référence de toutes les Firestore Security Rules.

---

# Authentification

Le projet utilise Firebase Authentication.

Les méthodes d'authentification supportées sont :

- Email / Mot de passe

Les méthodes suivantes sont prévues mais non implémentées en V1 :

- Google
- Apple
- Facebook

---

# Utilisateur authentifié

Tout utilisateur authentifié possède :

Firebase UID

Ce Firebase UID constitue l'identifiant technique du projet.

---

# Rôles

Trois rôles sont définis.

## Player

Le joueur peut :

- consulter son profil
- consulter ses inscriptions
- consulter les disponibilités
- créer une réservation
- consulter ses réservations

Le joueur ne peut pas :

- modifier une réservation validée
- consulter les réservations des autres joueurs
- modifier les établissements
- modifier la configuration

---

## Manager

Le gérant possède tous les droits du joueur.

Il peut également :

- consulter les réservations de son établissement
- accepter une réservation
- refuser une réservation
- bloquer un créneau

Le gérant ne peut pas :

- modifier les saisons
- modifier les utilisateurs
- modifier les établissements

---

## Administrator

L'administrateur possède tous les droits.

Il peut :

- gérer les utilisateurs
- gérer les établissements
- gérer les saisons
- gérer la configuration
- importer les joueurs
- importer les inscriptions

---

# Collections

## users

Lecture

Le joueur peut uniquement consulter son document.

Modification

Le joueur peut modifier uniquement :

- prénom
- nom
- email

Les rôles sont réservés aux administrateurs.

---

## registrations

Lecture

Le joueur peut consulter uniquement ses inscriptions.

Modification

Réservée aux administrateurs.

---

## venues

Lecture

Autorisée pour tous les utilisateurs authentifiés.

Modification

Réservée aux administrateurs.

---

## reservations

Lecture

Le joueur peut consulter uniquement ses réservations.

Le gérant peut consulter les réservations de son établissement.

L'administrateur peut consulter toutes les réservations.

---

Création

Le joueur peut créer une réservation.

La réservation est toujours créée avec le statut :

PENDING

Le joueur ne peut jamais créer une réservation CONFIRMED.

---

Modification

Le joueur peut uniquement annuler une réservation PENDING.

Le gérant peut modifier :

PENDING

↓

CONFIRMED

ou

PENDING

↓

REFUSED

L'administrateur peut modifier tous les champs.

---

Suppression

Aucune suppression physique.

Les réservations utilisent uniquement :

CANCELLED

---

## system

Lecture

Tous les utilisateurs authentifiés.

Modification

Administrateurs uniquement.

---

# Contraintes

Une réservation est unique selon :

venueId

boardNumber

startAt

Cette contrainte est garantie par une transaction Firestore.

---

# Temps réel

Les données suivantes utilisent onSnapshot() :

- Planning
- Réservations
- Validation

---

# Sécurité Frontend

Les composants React ne doivent jamais :

- vérifier les rôles
- appliquer les permissions

Toutes les autorisations sont contrôlées par Firestore Rules.

---

# Sécurité Backend

Toutes les écritures passent par :

Repositories

↓

Transactions Firestore

↓

Security Rules

---

# Audit

Toutes les réservations possèdent :

createdAt

updatedAt

validatedBy

---

# Journalisation

Les erreurs critiques sont enregistrées.

Les logs de développement sont désactivés en production.

---

# Principe

Le Frontend ne constitue jamais une protection.

La sécurité est assurée exclusivement par Firebase Authentication et Firestore Security Rules.

---

# Objectif V1

Empêcher :

- les doubles réservations
- la modification des réservations validées
- la consultation des données d'un autre joueur
- toute écriture non autorisée