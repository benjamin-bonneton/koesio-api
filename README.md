# API - Gestion de bibliothèque

Une API REST pour gérer les ressources de la bibliothèque, notamment les livres, les auteurs et les emprunts.

**Les fonctionnalités :**

- **Gestion des livres :**
    - Création, lecture, mise à jour et suppression de livres.
    - Récupération de la liste des livres disponibles.
    - Recherche de livres par titre, auteur ou genre.

- **Gestion des auteurs :**
    - Création, lecture, mise à jour et suppression d'auteurs
    - Récupération de la liste des auteurs
    - Récupération des livres écrits par un auteur donné.

- **Gestion des Emprunts :**
    - Création et retour d'emprunts
    - Récupération de la liste des emprunts en cours
    - Recherche des emprunts par utilisateur ou par livre

**Détails techniques :**

- **Framework :** 
    - NodeJS
    - Express.js

- **Base de données :**
    - MySQL
    - PhpMyAdmin

- **Frontend (Framework JS) :**
    - React

- **Déploiement :**
    - Docker

## Header

Arguments :

- username
- key_pass

## Auteurs

### Ajouter un auteur : /auteurs (POST)

Arguments :

- nom (str)
- prenom (str)

### Lecture d'un auteur : /auteurs/:id (GET)

Arguments :

- id (int)

### Lecture de tous les auteurs : /auteurs

Arguments :

- aucun

### Mettre à jour un auteur : /auteurs/:id (PUT)

Arguments :

- id (int)
- nom (str)
- prenom (str)

### Supprimer un auteur : /auteurs/:id (DELETE)

Arguments :

- id (int)

## Livres

### Ajouter un livre : /livres (POST)

Arguments :

- titre (str)
- id_genre (int)
- id_auteur (int)

### Lecture d'un livre : /livres/:id (GET)

Arguments :

- id (int)

### Mettre à jour un livre : /livres/:id (PUT)

Arguments :

- id (int)
- titre (str)
- id_genre (int)
- id_auteur (int)

### Supprimer un livre : /livres/:id (DELETE)

Arguments :

- id (int)

### Obtenir les livres avec les paramètres spécifiés : /livres (GET)

Arguments :

- titre (str) (optionnel)
- id_auteur (str) (optionnel) : chaque valeur doit être séparée par une virgule
- id_genre (str) (optionnel) : chaque valeur doit être séparée par une virgule
- disponible (bool) (optionnel)

## Utilisateurs

### Ajouter un utilisateur : /utilisateurs (POST)

Arguments :

- nom (str)
- prenom (str)

### Lecture d'un utilisateur : /utilisateurs/:id (GET)

Arguments :

- id (int)

### Lecture de tous les utilisateurs : /utilisateurs

Arguments :

- aucun

### Mettre à jour un utilisateur : /utilisateurs/:id (PUT)

Arguments :

- id (int)
- nom (str)
- prenom (str)

### Supprimer un utilisateur : /utilisateurs/:id (DELETE)

Arguments :

- id (int)

## Emprunts

### Création d'un emprunt : /emprunts (POST)

Arguments :

- id_livre (int)
- id_utilisateur (int)

### Retour d'un emprunt : /emprunts/:id (PUT)

Arguments :

- id (int)

### Recherche des emprunts par utilisateur, par livre ou par emprunt en cours : /emprunts (GET)

Arguments :

- id_utilisateur (int) (optionnel)
- id_livre (int) (optionnel)
- en_cours (bool) (optionnel)