# US-001 - Connexion

Version : 1.0

Etat

🟢 Terminée

---

# Objectif

Permettre à un joueur de se connecter à l'application.

---

# Valeur métier

Le joueur doit pouvoir accéder à son espace personnel.

---

# Acteur

Joueur

---

# Prérequis

Le compte Firebase existe.

Le compte est activé.

---

# Parcours

Landing

↓

Connexion

↓

Dashboard

---

# Données

Email

Mot de passe

---

# Règles

Le mot de passe est contrôlé par Firebase.

La session est persistante.

---

# Cas d'erreur

Email inconnu

Mot de passe incorrect

Utilisateur désactivé

---

# Critères d'acceptation

Connexion réussie.

Redirection Dashboard.

Session persistante.

Déconnexion.

---

# Composants

LoginPage

LoginForm

useLogin

AuthProvider

ProtectedRoute

---

# Tests

Connexion valide

Connexion invalide

Déconnexion

Session persistante

---

# Definition of Done

Build vert

Tests OK

Documentation mise à jour