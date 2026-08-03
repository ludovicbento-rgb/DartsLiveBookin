# DartsLive Bookin

# 03 - Modèle de données Firestore

Version : 0.1.0

Statut : Validé Sprint 0

---

# 1. Objet

Ce document décrit le modèle de données Firestore utilisé par
DartsLive Bookin.

Il constitue la référence officielle du projet.

Toute évolution du modèle de données devra être réalisée ici avant le développement.

---

# 2. Principes de conception

## UUID

Toutes les collections utilisent un UUID Firestore.

Aucun identifiant métier Dartslive n'est utilisé comme clé primaire.

---

## Références

Toutes les relations utilisent des références Firestore.

Exemple

reservation

↓

registrationId

↓

venueId

↓

boardId

↓

timeSlotId

---

## Suppression

Les données métier ne sont jamais supprimées physiquement.

Les collections utilisent les champs :

- isActive
- deletedAt
- deletedBy

---

## Audit

Toutes les collections métier possèdent :

- createdAt
- createdBy
- updatedAt
- updatedBy

---

## Langue

Application

Français

Code

Anglais

---

# 3. Diagramme général

Season

↓

Pool

↓

Registration

↓

RegistrationMember

↓

User

↓

Reservation

↓

TimeSlot

↓

Board

↓

Venue

---

# 4. Collections

La V1 comporte les collections suivantes.

users

seasons

pools

registrations

registrationMembers

venues

boards

timeSlots

reservations

events

notifications

auditLogs

settings

---

# 5. Collection users

## Description

Contient tous les utilisateurs de l'application.

Un utilisateur possède un seul compte.

Il peut être :

- Joueur
- Gérant
- Administrateur

Il peut également participer à plusieurs compétitions :

- Individuel
- Doublette
- Équipe

---

## Structure

| Champ | Type | Obligatoire |
|--------|------|-------------|
| id | UUID | Oui |
| email | string | Oui |
| licenseNumber | string | Oui |
| firstname | string | Oui |
| lastname | string | Oui |
| phone | string | Non |
| roles | array<string> | Oui |
| managedVenueId | UUID | Non |
| defaultCompetitionType | enum | Oui |
| lastLogin | timestamp | Non |
| isActive | boolean | Oui |
| createdAt | timestamp | Oui |
| createdBy | UUID | Oui |
| updatedAt | timestamp | Oui |
| updatedBy | UUID | Oui |
| deletedAt | timestamp | Non |
| deletedBy | UUID | Non |

---

## roles

Valeurs possibles

PLAYER

MANAGER

ADMIN

Exemple

[
 "PLAYER",
 "MANAGER"
]

---

## Contraintes

email unique

licenseNumber unique

Un seul compte par licence.

---

## Exemple JSON

{
  "email": "ludovic@email.fr",
  "licenseNumber": "12345678",
  "firstname": "Ludovic",
  "lastname": "Bento",
  "roles": [
      "PLAYER"
  ],
  "defaultCompetitionType": "DOUBLES",
  "isActive": true
}

---

# 6. Collection seasons

## Description

Une saison correspond à une édition du Championnat de France.

Exemples

Championnat de France 2026

Championnat de France 2027

---

## Structure

| Champ | Type |
|--------|------|
| id | UUID |
| year | number |
| name | string |
| startDate | timestamp |
| endDate | timestamp |
| isActive | boolean |
| createdAt | timestamp |
| createdBy | UUID |
| updatedAt | timestamp |
| updatedBy | UUID |
| deletedAt | timestamp |
| deletedBy | UUID |

---

## Contraintes

Une seule saison active.

Une année unique.

---

## Exemple JSON

{
  "year": 2026,
  "name": "Championnat de France Dartslive 2026",
  "startDate": "2026-08-01T08:00:00Z",
  "endDate": "2026-08-03T23:00:00Z",
  "isActive": true
}

---

# 7. Collection pools

## Description

Une poule appartient à une saison.

Exemples

Poule 9

Poule 10

Poule 11

Poule 12

---

## Structure

| Champ | Type |
|--------|------|
| id | UUID |
| seasonId | UUID |
| code | string |
| name | string |
| isActive | boolean |
| createdAt | timestamp |
| createdBy | UUID |
| updatedAt | timestamp |
| updatedBy | UUID |
| deletedAt | timestamp |
| deletedBy | UUID |

---

## Exemple JSON

{
    "seasonId":"...",
    "code":"P09",
    "name":"Poule 9",
    "isActive":true
}
# 03-DATABASE_MODEL.md

# Partie 2

## Collections métier

---

# Collection registrations

## Description

Une inscription représente une participation officielle au Championnat de France Dartslive.

Une inscription peut être :

- Individuel
- Doublette
- Équipe

Une inscription est créée uniquement par import du fichier officiel du championnat.

Les utilisateurs ne créent jamais d'inscription.

---

## Relations

Season

↓

Pool

↓

Registration

↓

Registration Members

↓

Users

↓

Reservations

---

## Structure

| Champ | Type | Obligatoire | Description |
|--------|------|-------------|-------------|
| id | UUID | Oui | Identifiant Firestore |
| seasonId | UUID | Oui | Saison |
| poolId | UUID | Oui | Poule |
| officialRegistrationId | string | Oui | Identifiant officiel Dartslive |
| competitionType | enum | Oui | INDIVIDUAL / DOUBLES / TEAM |
| registrationName | string | Oui | Nom affiché |
| isActive | boolean | Oui | Actif |
| version | number | Oui | Version du document |
| metadata | map | Oui | Informations complémentaires |
| createdAt | timestamp | Oui | Création |
| createdBy | UUID | Oui | Créateur |
| updatedAt | timestamp | Oui | Dernière modification |
| updatedBy | UUID | Oui | Modificateur |
| deletedAt | timestamp | Non | Suppression logique |
| deletedBy | UUID | Non | Auteur suppression |

---

## Contraintes

officialRegistrationId unique par saison.

---

## Exemple

```json
{
  "seasonId": "season_2026",
  "poolId": "pool_09",
  "officialRegistrationId": "D12587",
  "competitionType": "DOUBLES",
  "registrationName": "Les Triple 20",
  "isActive": true,
  "version": 1,
  "metadata": {}
}
```

---

# Collection registrationMembers

## Description

Liste des utilisateurs appartenant à une inscription.

L'application ne gère jamais la composition du match.

Elle connaît uniquement les membres autorisés à réserver.

Tous les membres d'une inscription peuvent effectuer une réservation.

---

## Structure

| Champ | Type | Obligatoire |
|--------|------|-------------|
| id | UUID | Oui |
| registrationId | UUID | Oui |
| userId | UUID | Oui |
| isCaptain | boolean | Oui |
| isActive | boolean | Oui |
| version | number | Oui |
| metadata | map | Oui |
| createdAt | timestamp | Oui |
| createdBy | UUID | Oui |
| updatedAt | timestamp | Oui |
| updatedBy | UUID | Oui |
| deletedAt | timestamp | Non |
| deletedBy | UUID | Non |

---

## Contraintes

Le couple :

registrationId

+

userId

doit être unique.

---

## Exemple

```json
{
  "registrationId": "...",
  "userId": "...",
  "isCaptain": false,
  "isActive": true,
  "version": 1,
  "metadata": {}
}
```

---

# Collection venues

## Description

Liste des établissements partenaires.

V1

- Point Bar
- LesMurets.shop

---

## Structure

| Champ | Type |
|--------|------|
| id | UUID |
| code | string |
| name | string |
| address | string |
| postalCode | string |
| city | string |
| phone | string |
| email | string |
| website | string |
| instagram | string |
| logo | string |
| managerUserId | UUID |
| isActive | boolean |
| version | number |
| metadata | map |
| createdAt | timestamp |
| createdBy | UUID |
| updatedAt | timestamp |
| updatedBy | UUID |
| deletedAt | timestamp |
| deletedBy | UUID |

---

## Exemple

```json
{
  "code": "POINT_BAR",
  "name": "Point Bar",
  "logo": "point-bar.png",
  "managerUserId": "...",
  "isActive": true
}
```

---

# Collection boards

## Description

Une cible Dartslive.

Une cible appartient à un établissement.

---

## Structure

| Champ | Type |
|--------|------|
| id | UUID |
| venueId | UUID |
| code | string |
| name | string |
| displayOrder | number |
| isActive | boolean |
| version | number |
| metadata | map |
| createdAt | timestamp |
| createdBy | UUID |
| updatedAt | timestamp |
| updatedBy | UUID |
| deletedAt | timestamp |
| deletedBy | UUID |

---

## Exemple

```json
{
  "venueId": "...",
  "code": "PB01",
  "name": "Cible 1",
  "displayOrder": 1,
  "isActive": true
}
```

---

# Collection timeSlots

## Description

Créneaux de réservation.

Ils sont générés par l'administrateur.

Durée par défaut :

90 minutes.

---

## Structure

| Champ | Type |
|--------|------|
| id | UUID |
| seasonId | UUID |
| venueId | UUID |
| boardId | UUID |
| startDateTime | timestamp |
| endDateTime | timestamp |
| isBookable | boolean |
| isActive | boolean |
| version | number |
| metadata | map |
| createdAt | timestamp |
| createdBy | UUID |
| updatedAt | timestamp |
| updatedBy | UUID |
| deletedAt | timestamp |
| deletedBy | UUID |

---

## Exemple

```json
{
  "seasonId": "...",
  "venueId": "...",
  "boardId": "...",
  "startDateTime": "2026-08-02T18:00:00Z",
  "endDateTime": "2026-08-02T19:30:00Z",
  "isBookable": true,
  "isActive": true
}
```
# 03-DATABASE_MODEL.md

# Partie 3

## Collections opérationnelles

---

# Collection reservations

## Description

Une réservation représente une demande de réservation d'un créneau
pour une inscription.

Une réservation est toujours liée :

- à une saison
- à une inscription
- à un établissement
- à une cible
- à un créneau

---

## Cycle de vie

PENDING

↓

CONFIRMED

↓

CANCELLED

ou

PENDING

↓

REJECTED

---

## Structure

| Champ | Type | Obligatoire | Description |
|--------|------|-------------|-------------|
| id | UUID | Oui | Identifiant Firestore |
| reservationNumber | string | Oui | Numéro lisible (ex : RES-2026-000001) |
| seasonId | UUID | Oui | Saison |
| registrationId | UUID | Oui | Inscription |
| venueId | UUID | Oui | Établissement |
| boardId | UUID | Oui | Cible |
| timeSlotId | UUID | Oui | Créneau |
| status | enum | Oui | Voir ci-dessous |
| managerComment | string | Non | Commentaire du gérant |
| validatedAt | timestamp | Non | Date de validation |
| validatedBy | UUID | Non | Gérant ayant validé |
| cancelledAt | timestamp | Non | Date d'annulation |
| cancelledBy | UUID | Non | Auteur de l'annulation |
| rejectionReason | string | Non | Motif de refus |
| isActive | boolean | Oui | Actif |
| version | number | Oui | Version |
| metadata | map | Oui | Métadonnées |
| createdAt | timestamp | Oui | Création |
| createdBy | UUID | Oui | Créateur |
| updatedAt | timestamp | Oui | Modification |
| updatedBy | UUID | Oui | Modificateur |
| deletedAt | timestamp | Non | Suppression logique |
| deletedBy | UUID | Non | Auteur suppression |

---

## Status

PENDING

CONFIRMED

REJECTED

CANCELLED

---

## Contraintes

Une inscription ne peut pas avoir deux réservations
CONFIRMED ou PENDING
sur un créneau qui se chevauche.

Une cible ne peut avoir qu'une seule réservation
CONFIRMED sur un même créneau.

---

## Exemple

```json
{
  "reservationNumber": "RES-2026-000154",
  "seasonId": "...",
  "registrationId": "...",
  "venueId": "...",
  "boardId": "...",
  "timeSlotId": "...",
  "status": "PENDING",
  "managerComment": "",
  "isActive": true,
  "version": 1,
  "metadata": {}
}
```

---

# Collection events

## Description

Evénement empêchant tout ou partie des réservations.

Exemples :

- Soirée privée
- Maintenance
- Fermeture exceptionnelle

---

## Structure

| Champ | Type |
|--------|------|
| id | UUID |
| seasonId | UUID |
| venueId | UUID |
| boardId | UUID (nullable) |
| title | string |
| description | string |
| startDateTime | timestamp |
| endDateTime | timestamp |
| isBlocking | boolean |
| isActive | boolean |
| version | number |
| metadata | map |
| createdAt | timestamp |
| createdBy | UUID |
| updatedAt | timestamp |
| updatedBy | UUID |
| deletedAt | timestamp |
| deletedBy | UUID |

---

## boardId

Si null :

→ tout l'établissement est concerné.

Sinon :

→ uniquement la cible concernée.

---

## Exemple

```json
{
  "venueId": "...",
  "title": "Soirée privée",
  "startDateTime": "...",
  "endDateTime": "...",
  "isBlocking": true
}
```

---

# Collection notifications

## Description

Centre de notifications interne.

Aucune notification Push dans la V1.

---

## Structure

| Champ | Type |
|--------|------|
| id | UUID |
| userId | UUID |
| title | string |
| message | string |
| type | enum |
| isRead | boolean |
| readAt | timestamp |
| version | number |
| metadata | map |
| createdAt | timestamp |

---

## type

INFO

SUCCESS

WARNING

ERROR

---

## Exemple

```json
{
  "userId": "...",
  "title": "Réservation confirmée",
  "message": "Votre réservation de 19h30 a été confirmée.",
  "type": "SUCCESS",
  "isRead": false
}
```

---

# Collection auditLogs

## Description

Historique des actions.

Aucune suppression.

---

## Structure

| Champ | Type |
|--------|------|
| id | UUID |
| userId | UUID |
| action | string |
| entity | string |
| entityId | UUID |
| oldValue | map |
| newValue | map |
| ipAddress | string |
| userAgent | string |
| createdAt | timestamp |

---

## Exemple

```json
{
  "userId": "...",
  "action": "RESERVATION_CONFIRMED",
  "entity": "reservations",
  "entityId": "...",
  "createdAt": "..."
}
```

---

# Collection settings

## Description

Paramètres généraux de l'application.

Une seule collection.

Un seul document.

ID :

application

---

## Structure

| Champ | Type |
|--------|------|
| activeSeasonId | UUID |
| defaultReservationDuration | number |
| maintenanceMode | boolean |
| language | string |
| timezone | string |
| applicationName | string |
| version | number |
| updatedAt | timestamp |
| updatedBy | UUID |

---

## Exemple

```json
{
  "activeSeasonId": "...",
  "defaultReservationDuration": 90,
  "maintenanceMode": false,
  "language": "fr",
  "timezone": "Europe/Paris",
  "applicationName": "DartsLive Bookin",
  "version": 1
}
```  
