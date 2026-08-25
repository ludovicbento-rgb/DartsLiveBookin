# DartsLive Bookin

# Coding Guidelines

Version : 0.4.0-alpha

---

# Objectif

Ce document définit les conventions de développement du projet.

Toute contribution doit respecter ces règles.

---

# Philosophie

Le projet privilégie :

- la simplicité
- la lisibilité
- la maintenabilité
- la cohérence

Toute optimisation prématurée est interdite.

---

# TypeScript

Mode strict obligatoire.

Aucun any.

Toujours préférer :

```ts
interface
```

aux types anonymes.

Les types métier sont placés dans :

```
entities/
```

---

# React

Toujours utiliser des composants fonctionnels.

Les Hooks sont obligatoires.

Les composants ne contiennent jamais :

- appels Firestore
- logique métier
- règles de sécurité

---

# Hooks

Les Hooks représentent la logique applicative.

Ils sont placés dans :

```
features/*/hooks
```

Ils utilisent :

Repositories

Jamais Firestore directement.

---

# Entities

Chaque entité possède toujours :

```
entity.types.ts

entity.firestore.ts

entity.repository.ts

index.ts
```

Aucun composant React dans entities.

---

# Features

Une Feature contient :

```
components

hooks

pages

api

utils
```

Une Feature représente toujours un cas d'usage.

---

# Shared

Shared contient uniquement :

- composants génériques
- helpers
- thème
- Firebase
- constantes

Jamais de logique métier.

---

# Widgets

Les Widgets représentent des composants métier complexes.

Exemples

DashboardHeader

VenueCard

Footer

Header

---

# Pages

Les pages métier sont placées dans :

```
features/*/pages
```

Le dossier :

```
pages
```

contient uniquement :

Home

Maintenance

NotFound

---

# Firestore

Firestore est la seule source de vérité.

Les composants React ne parlent jamais directement à Firestore.

Toujours utiliser :

Repository

↓

Hook

↓

React

---

# Repository

Les Repositories réalisent uniquement :

Lecture

Ecriture

Transactions

Ils ne contiennent jamais :

JSX

Hooks

React

---

# Commands

Les Commands représentent la logique métier complexe.

Exemple

createReservation()

↓

Validation

↓

Transaction

↓

Notification

↓

Repository

---

# UI

Tous les composants UI utilisent :

Material UI

Les styles utilisent :

sx

Aucune feuille CSS.

---

# Imports

Toujours utiliser les alias :

```
@/
```

Exemple

```ts
import {
    getUserByUid,
} from "@/entities/user";
```

---

# Barrel Exports

Tous les dossiers possèdent un :

index.ts

Les imports directs sont interdits lorsqu'un barrel existe.

---

# Nommage

Composants

PascalCase

Hooks

camelCase

Préfixe :

use

Exemple

usePlanning()

---

# Interfaces

Suffixe

Props

Exemple

PlanningHeaderProps

---

# Firestore

Collections

camelCase

Documents

kebab-case

Exemple

point-bar

---

# Commits

Convention

Conventional Commits

Exemple

feat(planning):

fix(auth):

refactor(user):

docs(architecture):

---

# Branches

feature/us-001-login

feature/us-004-planning

bugfix/...

hotfix/...

---

# Pull Requests

Une Pull Request

=

Une User Story

Le build doit être vert.

Les tests doivent être exécutés.

---

# Tests

Toute fonction métier doit posséder un test.

Exemple

buildPlanning()

↓

buildPlanning.test.ts

---

# Documentation

Toute évolution importante doit mettre à jour :

ROADMAP

BACKLOG

USER STORY

ADR

---

# Build

Le projet doit toujours compiler.

Aucun warning TypeScript.

Aucune erreur ESLint.

---

# Qualité

Le code doit être :

Lisible

Simple

Documenté

Testable

---

# Règle d'or

Les composants React affichent.

Les Hooks orchestrent.

Les Commands décident.

Les Repositories accèdent aux données.

Firestore stocke.

Chaque couche possède une seule responsabilité.