Help Desk - Gestion de Tickets

Application full-stack de gestion de tickets d'assistance (help desk interne).
Frontend **React + TypeScript + Vite + Tailwind CSS**, backend **Node.js + Express + TypeScript + SQLite (better-sqlite3)**.


## Choix techniques

| Domaine | Choix | Justification                                                                                                                       |
|---|---|-------------------------------------------------------------------------------------------------------------------------------------|
| Backend | Node.js + Express + TypeScript | Simple, rapide à mettre en place                                                                                                    |
| Base de données | SQLite via better-sqlite3 | Zéro configuration, fichier unique, API synchrone simple                                                                            |
| Validation | zod | Schémas déclaratifs et messages d'erreur clairs                                                                                     |
| Frontend | React + Vite + TypeScript | Typage strict                                                                                                                       |
| Style | Tailwind CSS | Je l'ai utilisé pour la cohérence visuelle rapide sans fichiers CSS multiples                                                       |
| Routing | React Router v6 | C'est un standard pour le routing en React                                                                                          |
| Appels API | Axios | Pour la gestion d'erreurs et intercepteurs plus confortables que fetch nu                                                           |
| État | useState  | L'application est une application simple donc avec peu de données partagées entre pages) |

Le projet est dans un  dossier à deux dossiers(backend et frontend), chacun avec sa propre architecture.

## Installation et lancement

Le backend et le frontend se lancent séparément, dans deux terminaux.

### 1. Backend (API)

cd backend
npm install
npm run seed   #pour initialiser les données tests dans la base de données             
npm run dev               

### 2. Frontend

Dans un second terminal :

cd frontend
npm install
npm run dev              


## Variables d'environnement

### backend/.env

| Variable | Défaut | Description                                                   |
|---|---|---------------------------------------------------------------|
| PORT | 4000 | Port d'écoute de l'API                                        |
| DB_PATH | ./data/helpdesk.db | Emplacement du fichier SQLite (ça a été créé automatiquement) |
| CORS_ORIGIN | http://localhost:5173 | Origine autorisée pour les requêtes CORS (l'url du frontend)  |

### frontend/.env

| Variable     | Défaut | Description |
|--------------|---|---|
| VITE_API_URL | http://localhost:4000/api | URL de base de l'API consommée par le frontend |


## Fonctionnalités couvertes

- Tableau de bord avec compteurs par statut, tickets critiques actifs, 5 derniers tickets modifiés et répartition graphique par statut
- Liste des tickets avec recherche par titre, filtres (statut / priorité / catégorie) et tri (date, priorité), filtres persistés dans l'URL ("/tickets?status=open&priority=high")
- Détail d'un ticket avec changement de statut et d'assigné en ligne en plus des commentaires de commentaires
- Création et modification de ticket avec validation des champs obligatoires
- Suppression de ticket avec confirmation
- Gestion des états de chargement et d'erreur sur toutes les pages
