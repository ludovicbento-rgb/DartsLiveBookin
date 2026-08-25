# US-002 - Activation du compte

Etat

🔴 Non démarrée

---

# Objectif

Associer une licence Dartslive à un compte Firebase.

---

# Valeur métier

Permettre à un joueur de créer son compte.

---

# Acteur

Joueur

---

# Parcours

Landing

↓

Activer mon compte

↓

Numéro de licence

↓

Recherche Firestore

↓

Licence trouvée

↓

Email

↓

Mot de passe

↓

Création Firebase

↓

Dashboard

---

# Données

Licence

Email

Mot de passe

Confirmation

---

# Firestore

Collection

users

---

# Critères

Licence valide

Création Firebase

Association UID

Connexion automatique

---

# Composants

ActivateAccountPage

ActivateAccountForm

activation.service

---

# Tests

Licence inconnue

Licence connue

Email déjà utilisé

Création OK

---

# Definition of Done

Compte créé

Connexion automatique

Build vert