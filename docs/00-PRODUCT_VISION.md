# DartsLive Bookin

Version : 0.4.0-alpha

---

# Vision du produit

DartsLive Bookin est une application web permettant de gérer les réservations des créneaux de jeu dans le cadre du Championnat de France Dartslive.

L'objectif principal est de simplifier l'organisation des rencontres entre joueurs et de limiter les conflits de réservation dans les établissements partenaires.

L'application est développée avec React, TypeScript et Firebase (Authentication, Firestore et Hosting).

---

# Contexte

Aujourd'hui les réservations sont réalisées de manière manuelle :

- Messenger
- Facebook
- SMS
- Téléphone

Cela entraîne :

- doubles réservations
- manque de visibilité
- difficultés pour les gérants
- absence d'historique

DartsLive Bookin apporte une solution unique permettant :

- la réservation des créneaux
- la validation par le gérant
- une vision en temps réel des disponibilités
- un historique complet

---

# Objectifs

Les objectifs du projet sont :

- réduire les erreurs de réservation
- simplifier l'organisation des matchs
- offrir une application mobile intuitive
- fournir une vision temps réel des disponibilités
- limiter les échanges entre joueurs et gérants

---

# Public cible

L'application est destinée à quatre profils.

## Joueur

Peut :

- consulter les disponibilités
- réserver un créneau
- consulter ses réservations

---

## Gérant

Peut :

- consulter les demandes
- valider ou refuser une réservation
- bloquer des créneaux
- fermer temporairement son établissement

---

## Administrateur

Peut :

- gérer les saisons
- gérer les établissements
- importer les joueurs
- importer les inscriptions
- gérer les utilisateurs

---

## Organisation

Peut :

- suivre l'activité globale
- produire des statistiques
- superviser les championnats

---

# Valeur ajoutée

DartsLive Bookin apporte :

- réservation temps réel
- synchronisation Firestore
- suppression des doubles réservations
- visibilité immédiate des disponibilités
- gestion centralisée des établissements

---

# Fonctionnalités principales

- Authentification Firebase
- Activation des comptes
- Dashboard joueur
- Gestion des inscriptions
- Planning des établissements
- Réservation
- Validation
- Administration
- Notifications

---

# Hors périmètre V1

Ne seront pas développés :

- paiement
- géolocalisation
- chat
- messagerie
- classement
- statistiques avancées

---

# Stack technique

Frontend

- React
- TypeScript
- Vite
- Material UI

Backend

- Firebase Authentication
- Firestore
- Firebase Hosting

---

# Architecture

Le projet suit une architecture Feature-Sliced Design simplifiée.

app

entities

features

shared

widgets

---

# Etat actuel

Architecture :

Stabilisée

Build :

Vert

Authentification :

Terminée

Planning :

En cours

Réservation :

En cours

Administration :

Non démarrée

---

# Vision V1

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