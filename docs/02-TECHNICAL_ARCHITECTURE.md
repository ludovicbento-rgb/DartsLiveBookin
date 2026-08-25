# DartsLive Bookin

# Architecture Technique

Version : 0.4.0-alpha

---

# Objectif

Ce document décrit l'architecture technique de DartsLive Bookin.

Il constitue la référence de développement du projet.

Toute évolution devra respecter les principes définis ici.

---

# Stack Technique

## Frontend

- React 19
- TypeScript
- Vite
- React Router
- Material UI

---

## Backend

Firebase

- Authentication
- Firestore
- Hosting

---

## Langage

TypeScript

Mode strict activé.

---

# Architecture

Le projet suit une architecture Feature-Sliced Design simplifiée.

```
src

app

entities

features

shared

widgets

pages

assets
```

---

# app

Responsabilité

Bootstrap de l'application.

Contient :

- Providers
- Router
- Layout

Aucune logique métier.

---

# entities

Les entités représentent les objets métier.

Chaque entité possède toujours la même structure.

Exemple

```
entities

reservation

reservation.types.ts

reservation.firestore.ts

reservation.repository.ts

index.ts
```

Les entités ne contiennent jamais :

- React
- Hooks
- JSX

---

# features

Les Features représentent les cas d'usage.

Exemples

- authentication
- planning
- reservations
- registrations

Une Feature peut utiliser plusieurs entités.

Une entité ne dépend jamais d'une Feature.

---

# shared

Composants réutilisables.

Exemples

- AppButton
- AppSnackbar
- AppCard
- Theme
- Firebase
- Utils

---

# widgets

Les Widgets représentent des composants métier complexes.

Exemple

DashboardHeader

VenueCard

BottomNavigation

Header

Footer

---

# pages

Uniquement les pages globales.

Exemple

Home

Maintenance

NotFound

Les pages métier sont placées dans les Features.

---

# Dépendances

```
App

↓

Features

↓

Entities

↓

Firestore
```

Les dépendances inverses sont interdites.

---

# Firestore

Firestore constitue la source unique de vérité.

Aucune donnée métier ne doit être conservée uniquement côté React.

---

# Repositories

Chaque entité possède son Repository.

Exemple

```
ReservationRepository

createReservation()

getReservationsByPlayer()

getReservationsByVenueAndDay()
```

Le Repository ne contient jamais :

- React
- JSX
- Hooks

---

# Hooks

Les Hooks représentent la logique applicative.

Exemple

usePlanning()

↓

ReservationRepository

↓

Firestore

---

# React

Les composants React affichent uniquement les données.

Ils ne contiennent aucune logique métier.

Ils ne parlent jamais directement à Firestore.

---

# Flux Authentification

```
LoginPage

↓

useLogin()

↓

AuthProvider

↓

Firebase Authentication

↓

Dashboard
```

---

# Flux Planning

```
PlanningPage

↓

usePlanning()

↓

ReservationRepository

↓

Firestore

↓

buildPlanning()

↓

PlanningPage
```

---

# Flux Réservation

```
Planning

↓

ReservationDialog

↓

useCreateReservation()

↓

ReservationRepository

↓

Firestore Transaction
```

---

# Temps réel

Toutes les mises à jour du planning utiliseront :

onSnapshot()

Le rechargement manuel est interdit.

---

# Règles

Une PR = Une User Story.

Le projet doit compiler après chaque PR.

Aucun refactoring sans justification métier.

Tous les composants utilisent TypeScript strict.

Les Hooks ne parlent jamais directement à Firestore.

Les composants React ne parlent jamais à Firestore.

---

# Organisation des fichiers

Chaque Feature suit la structure suivante.

```
Feature

components

hooks

pages

api

model

utils
```

---

# Organisation des entités

```
Entity

entity.types.ts

entity.firestore.ts

entity.repository.ts

index.ts
```

---

# Qualité

Build vert obligatoire.

ESLint obligatoire.

TypeScript strict obligatoire.

Aucun warning accepté.

---

# Objectif V1

Architecture figée.

Les développements futurs concernent uniquement :

- fonctionnalités métier
- optimisation
- sécurité
- tests