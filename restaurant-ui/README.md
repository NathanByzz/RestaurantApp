# RestaurantApp

RestaurantApp est une application web de commande de repas permettant à trois types d'utilisateurs d'interagir avec le système :

- Client
- Restaurateur
- Livreur

Le client peut consulter les restaurants, voir les menus, ajouter des plats au panier, passer une commande et suivre son statut.

Le restaurateur peut créer un restaurant, gérer son menu, ajouter, modifier ou supprimer des plats, consulter les commandes reçues et modifier leur statut.

Le livreur peut consulter les commandes à livrer, les prendre en livraison et les marquer comme livrées.

---

## Technologies utilisées

### Frontend

- Angular
- TypeScript
- HTML
- CSS
- Angular Routing
- Angular Guards
- Angular Services
- LocalStorage pour stocker le token JWT

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQLite
- JWT Authentication
- BCrypt pour le hachage des mots de passe
- Swagger pour tester l'API

---

## Structure du projet

```text
RestaurantApp
│
├── RestaurantApi
│   ├── Controllers
│   ├── Data
│   ├── DTOs
│   ├── Models
│   ├── Services
│   ├── Migrations
│   ├── Program.cs
│   ├── appsettings.json
│   └── restaurant.db
│
└── restaurant-ui
    ├── src
    │   └── app
    │       ├── models
    │       ├── pages
    │       ├── services
    │       ├── app.routes.ts
    │       ├── app.html
    │       └── app.ts
    ├── angular.json
    └── package.json