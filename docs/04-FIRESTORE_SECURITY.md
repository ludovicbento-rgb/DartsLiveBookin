# DartsLive Bookin

# 04 - Firestore Security

Version : 0.1.0

Statut : Sprint 0

---

# 1. Objectif

Les règles Firestore doivent garantir que :

- un joueur ne puisse consulter que ses propres données ;
- un gérant ne puisse gérer que son établissement ;
- un administrateur dispose d'un accès complet.

Toutes les règles sont appliquées côté serveur.

Aucune règle de sécurité ne repose uniquement sur React.

---

# 2. Authentification

Toutes les opérations nécessitent un utilisateur authentifié.

Règle générale

request.auth != null

---

# 3. Rôles

Les rôles sont stockés dans le document users.

Exemple

roles

player

manager

admin

---

# 4. Fonctions

isAuthenticated()

Utilisateur connecté

isAdmin()

roles.admin == true

isManager()

roles.manager == true

isPlayer()

roles.player == true

isOwner(userId)

Le document appartient à l'utilisateur connecté.

isVenueManager(venueId)

Le manager gère cet établissement.

isRegistrationMember(registrationId)

Le joueur appartient à cette inscription.

---

# 5. Collection users

Lecture

Utilisateur

→ son document

Manager

→ son document

Admin

→ tous

Création

Libre (inscription)

Modification

Utilisateur

→ son téléphone

→ son email

Admin

→ tous les champs

Suppression

Interdite

---

# 6. Collection seasons

Lecture

Tout utilisateur connecté

Création

Admin

Modification

Admin

Suppression

Interdite

---

# 7. Collection pools

Lecture

Tout utilisateur connecté

Création

Admin

Modification

Admin

Suppression

Interdite

---

# 8. Collection registrations

Lecture

Utilisateur appartenant à l'inscription

Manager

Admin

Création

Admin uniquement

Modification

Admin uniquement

Suppression

Interdite

---

# 9. Collection registrationMembers

Lecture

Membres de l'inscription

Manager

Admin

Création

Admin

Modification

Admin

Suppression

Interdite

---

# 10. Collection venues

Lecture

Tout utilisateur connecté

Création

Admin

Modification

Admin

Suppression

Interdite

---

# 11. Collection boards

Lecture

Tout utilisateur connecté

Création

Admin

Modification

Admin

Suppression

Interdite

---

# 12. Collection timeSlots

Lecture

Tout utilisateur connecté

Création

Admin

Modification

Admin

Suppression

Interdite

---

# 13. Collection reservations

Lecture

Player

→ réservations de ses inscriptions

Manager

→ réservations de son établissement

Admin

→ toutes

Création

Player

→ uniquement pour une inscription dont il est membre

Manager

→ aucune

Admin

→ toutes

Modification

Player

→ uniquement une réservation PENDING

Manager

→ validation

→ refus

→ commentaire

Admin

→ toutes

Suppression

Interdite

Suppression logique uniquement.

---

# 14. Collection events

Lecture

Tout utilisateur connecté

Création

Manager

→ uniquement son établissement

Admin

→ toutes

Modification

Même règle

Suppression

Suppression logique

---

# 15. Collection notifications

Lecture

Uniquement le propriétaire

Création

Application

Admin

Modification

Uniquement

isRead

Suppression

Interdite

---

# 16. Collection auditLogs

Lecture

Admin uniquement

Création

Application uniquement

Modification

Interdite

Suppression

Interdite

---

# 17. Collection settings

Lecture

Tout utilisateur connecté

Modification

Admin uniquement

---

# 18. Validation d'une réservation

Le manager peut modifier uniquement

status

managerComment

validatedAt

validatedBy

Le reste est interdit.

---

# 19. Mode maintenance

Lorsque

settings.maintenanceMode == true

Alors

Création réservation

Interdite

Modification réservation

Interdite

Lecture

Toujours autorisée.

---

# 20. Audit

Les opérations suivantes génèrent un audit :

Connexion

Création compte

Réservation

Validation

Refus

Annulation

Création événement

Modification paramètres

Import Excel

Mode maintenance

---

# 21. Règle générale

Tout ce qui n'est pas explicitement autorisé est interdit.
