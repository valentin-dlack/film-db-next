# Projet YNOV Cloud App

Ce projet est une application cloud développée dans le cadre du cours de M1 à YNOV. Il vise à démontrer l'utilisation des services cloud pour le déploiement d'une application web.

## Stack technologique

- Frontend : React.js
- Backend : Node.js
- Base de données : MongoDB Atlas

## Setup et lancement du projet

1. Clonez ce dépôt sur votre machine locale.
2. Assurez-vous d'avoir Node.js et npm installés sur votre machine.
3. Dans le dossier racine du projet, exécutez la commande `npm install --force` pour installer les dépendances.
4. Configurez les variables d'environnement nécessaires (par exemple, les clés d'accès The Movie Database, MongoDB Atlas, etc.). Vous pouvez utiliser le fichier `.env.example` comme modèle.
5. Lancez le serveur en exécutant la commande `npm run dev` (pour le mode de développement).
6. Accédez à l'application dans votre navigateur à l'adresse `http://localhost:3000`.

## État actuel du développement

Le développement de ce projet est en cours. Voici les fonctionnalités déjà implémentées :

- Connexion et inscription des utilisateurs
- Authentification des utilisateurs
- Affichage des données à partir de la base de données
- Communication avec l'API The Movie Database pour afficher les films populaires

Nous continuons à travailler sur les fonctionnalités suivantes :

- Ajout d'une Interface Utilisateur complète, pour les listes de films, les détails des films, etc.
- Amélioration des interactions avec l'API The Movie Database (likes, commentaires, etc.)
- Authentification des utilisateurs via localStorage pour maintenir la session
- Support des séries TV et des acteurs.
