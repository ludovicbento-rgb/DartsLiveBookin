# DartsLive Bookin

# Data Model

Version : 0.4.0-alpha

---

# Objectif

Ce document décrit le modèle de données du projet.

Il constitue la référence de toutes les collections Firestore.

Toute modification de ce document doit faire l'objet d'un ADR.

---

# Principes

Firestore constitue la source unique de vérité.

Les documents sont volontairement dénormalisés lorsque cela améliore les performances de lecture.

Les identifiants Firebase sont utilisés comme identifiants techniques.

---

# Collections

Le projet utilise les collections suivantes.

```
users

registrations

venues

reservations

system
```

---

# Collection users

Document ID

Firebase UID

Exemple

```
users

abc123456789
```

Structure

```typescript
UserProfile

firebaseUid

licenseNumber

firstname

lastname

email

seasonId

accountActivated

roles

status

createdAt

updatedAt

lastLoginAt
```

---

# Règles

Un utilisateur possède un seul document.

Le document est créé lors de l'activation du compte.

Le document est identifié par son UID Firebase.

---

# Collection registrations

Document ID

Firestore Auto ID

Structure

```typescript
Registration

playerUid

seasonId

competitionType

displayName

teamId

active
```

---

# Règles

Un joueur peut posséder plusieurs inscriptions.

Exemple

Individuel

Doublette

Equipe

Les réservations utilisent toujours une inscription.

Jamais directement un joueur.

---

# Collection venues

Document ID

point-bar

les-murets

...

Structure

```typescript
Venue

name

address

logoUrl

boardCount

active
```

---

# Règles

Un établissement possède plusieurs cibles.

Le nombre de cibles est défini par :

boardCount

---

# Collection reservations

Document ID

Firestore Auto ID

Structure

```typescript
Reservation

seasonId

venueId

registrationId

playerUid

boardNumber

startAt

endAt

status

createdAt

updatedAt

validatedBy

notes
```

---

# Statuts

PENDING

CONFIRMED

REFUSED

CANCELLED

---

# Contraintes métier

Une réservation est unique selon :

venueId

+

boardNumber

+

startAt

Une transaction Firestore garantit cette contrainte.

---

# Collection system

Document

configuration

Structure

```typescript
SystemConfiguration

applicationName

currentSeasonId

reservationDuration

reservationSlots
```

---

# Relations

```
User

↓

Registrations

↓

Reservations

↓

Venue

↓

Planning
```

---

# Planning

Le Planning n'est jamais stocké.

Il est calculé.

Planning

=

Créneaux

+

Réservations

---

# Temps réel

Toutes les réservations sont synchronisées avec :

onSnapshot()

Aucun rechargement manuel.

---

# Index Firestore

reservations

venueId

+

startAt

---

reservations

playerUid

+

startAt

---

reservations

registrationId

+

startAt

---

reservations

status

+

venueId

---

# Données de référence

Les établissements sont créés par l'administration.

Les saisons sont gérées par :

system.configuration.currentSeasonId

Les créneaux proviennent :

reservationSlots

---

# Volumétrie

Utilisateurs

≈ 500

Réservations

≈ 20 000

Etablissements

≈ 50

Saisons

≈ 10

---

# Performances

Toutes les lectures doivent être réalisées en moins de deux secondes.

Le Planning doit être chargé avec une seule requête Firestore.

---

# Evolution

Le modèle est compatible avec :

plusieurs saisons

plusieurs compétitions

plusieurs établissements

plusieurs équipes

temps réel

---

# Version

V1

Modèle figé.