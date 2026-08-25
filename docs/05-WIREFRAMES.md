# DartsLive Bookin

# Wireframes & UX

Version : 0.4.0-alpha

---

# Objectif

Ce document décrit l'ensemble des écrans de l'application.

Pour chaque écran sont décrits :

- son objectif
- les informations affichées
- les actions possibles
- les règles métier
- le parcours utilisateur

---

# Navigation générale

```

Landing

↓

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

Réservation

↓

Validation

↓

Historique

```

---

# Landing

Objectif

Présenter l'application.

Actions

- Se connecter
- Activer son compte

Wireframe

```

+---------------------------------------+

DartsLive Bookin

Championnat de France Dartslive

[ Se connecter ]

[ Activer mon compte ]

Version 0.4.0-alpha

+---------------------------------------+

```

---

# Connexion

Objectif

Authentifier le joueur.

Informations

- Adresse email
- Mot de passe

Actions

Connexion

Mot de passe oublié (V2)

Wireframe

```

+---------------------------------------+

Connexion

Email

[_____________________]

Mot de passe

[_____________________]

[ Se connecter ]

+---------------------------------------+

```

---

# Activation

Objectif

Associer une licence Dartslive à un compte Firebase.

Informations

- Numéro de licence
- Adresse email
- Mot de passe
- Confirmation

Actions

Activer mon compte

Wireframe

```

Licence

Email

Mot de passe

Confirmation

[ Activer ]

```

---

# Dashboard

Objectif

Présenter les établissements disponibles.

Informations

- joueur connecté
- saison active
- inscription sélectionnée

Wireframe

```

Bonjour Ludovic 👋

Championnat de France

Saison CF2027

Mon inscription

[Doublette ▼]

────────────────────────

Point Bar

Voir le planning

────────────────────────

LesMurets.shop

Voir le planning

```

---

# Planning

Objectif

Afficher les créneaux disponibles.

Informations

- établissement
- date
- disponibilité

Wireframe

```

Point Bar

25/08/2026

6 cibles disponibles

────────────────────────

18:00 - 19:30

+-------------+

🎯1

Disponible

+-------------+

+-------------+

🎯2

Réservée

+-------------+

────────────────────────

19:30 - 21:00

...

```

---

# Réservation

Objectif

Confirmer une réservation.

Wireframe

```

Réserver cette cible

Bar

Point Bar

Créneau

18:00 - 19:30

Cible

1

[ Annuler ]

[ Confirmer ]

```

---

# Historique

Objectif

Afficher les réservations du joueur.

Informations

- établissement
- créneau
- statut

Exemple

```

Point Bar

18:00

CONFIRMED

──────────────

LesMurets

19:30

PENDING

```

---

# Validation

Objectif

Permettre au gérant de traiter les demandes.

Wireframe

```

Demandes

──────────────────

Ludovic Bento

18:00

[ Valider ]

[ Refuser ]

```

---

# Administration

Objectif

Configurer l'application.

Fonctions

- saisons
- établissements
- joueurs
- inscriptions
- configuration

---

# Responsive

Desktop

Sidebar

Tablet

Drawer

Mobile

Bottom Navigation

---

# Couleurs

Vert

Disponible

Orange

En attente

Rouge

Réservée

Gris

Indisponible

---

# Icônes

🎯

Cible

📅

Planning

👤

Profil

🏢

Établissement

⚙️

Administration

---

# Parcours utilisateur V1

Connexion

↓

Dashboard

↓

Choix inscription

↓

Choix établissement

↓

Planning

↓

Choix cible

↓

Réservation

↓

Validation

↓

Historique