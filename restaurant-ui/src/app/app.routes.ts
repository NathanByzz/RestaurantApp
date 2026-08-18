import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Restaurants } from './pages/restaurants/restaurants';
import { RestaurantDetails } from './pages/restaurant-details/restaurant-details';
import { Cart } from './pages/cart/cart';
import { Orders } from './pages/orders/orders';
import { Restaurateur } from './pages/restaurateur/restaurateur';
import { RestaurateurMenu } from './pages/restaurateur-menu/restaurateur-menu';
import { RestaurateurOrders } from './pages/restaurateur-orders/restaurateur-orders';

import { clientGuard } from './services/client.guard';
import { restaurateurGuard } from './services/restaurateur.guard';
import { Livreur } from './pages/livreur/livreur';
import { livreurGuard } from './services/livreur.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'restaurants',
    component: Restaurants,
    canActivate: [clientGuard]
  },

  {
    path: 'restaurants/:id',
    component: RestaurantDetails,
    canActivate: [clientGuard]
  },

  {
    path: 'cart',
    component: Cart,
    canActivate: [clientGuard]
  },

  {
    path: 'mes-commandes',
    component: Orders,
    canActivate: [clientGuard]
  },

  {
    path: 'restaurateur',
    component: Restaurateur,
    canActivate: [restaurateurGuard]
  },

  {
    path: 'restaurateur/restaurants/:id/menu',
    component: RestaurateurMenu,
    canActivate: [restaurateurGuard]
  },

  {
    path: 'restaurateur/commandes',
    component: RestaurateurOrders,
    canActivate: [restaurateurGuard]
  },

  {
  path: 'livreur',
  component: Livreur,
  canActivate: [livreurGuard]
},

  { path: '**', redirectTo: 'login' }
];