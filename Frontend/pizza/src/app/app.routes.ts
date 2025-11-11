import { Routes } from '@angular/router';
import { PizzaMegjelenitComponent } from './Components/pages/pizza/pizza-megjelenit/pizza-megjelenit.component';
import { PizzaFelveszComponent } from './Components/pages/pizza/pizza-felvesz/pizza-felvesz.component';
import { RegistrationComponent } from './Components/pages/registration/registration.component';
import { LoginComponent } from './Components/pages/login/login.component';
import { LandingPageComponent } from './Components/pages/landing-page/landing-page.component';
import { ProfileOverviewComponent } from './Components/user/profile-overview/profile-overview.component';
import { ShoppingCartComponent } from './Components/shopping-cart/shopping-cart.component';
import { AdminDashboardComponent } from './Components/admin/admin-dashboard/admin-dashboard.component';
import { authGuard } from './Guards/auth.guard';
import { adminGuard } from './Guards/admin.guard';
import { FelhasznaloKezelesComponent } from './Components/admin/felhasznalo-kezeles/felhasznalo-kezeles.component';
import { RendelesekKezeleseComponent } from './Components/admin/rendelesek-kezelese/rendelesek-kezelese.component';
import { StatisztikakComponent } from './Components/admin/statisztikak/statisztikak.component';
import { FoglalasComponent } from './Components/pages/foglalas/foglalas.component';
import { ErtekelesirasaComponent } from './Components/pages/ertekelesirasa/ertekelesirasa.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },

  {
    path: 'pizzak',
    component: PizzaMegjelenitComponent,
    canActivate: [authGuard],
  },
  {
    path: 'pizzak/felvesz',
    component: PizzaFelveszComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'regisztracio',
    component: RegistrationComponent,
  },
  {
    path: 'bejelentkezes',
    component: LoginComponent,
  },
  {
    path: 'fiokom',
    component: ProfileOverviewComponent,
    canActivate: [authGuard],
  },
  {
    path: 'kosar',
    component: ShoppingCartComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/felhasznalo-kezeles',
    component: FelhasznaloKezelesComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/rendelesek-kezelese',
    component: RendelesekKezeleseComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/statisztikak',
    component: StatisztikakComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'foglalas',
    component: FoglalasComponent,
    canActivate: [authGuard],
  },
  {
    path: 'ertekeles',
    component: ErtekelesirasaComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '', // Ha nem található az útvonal, áét irányít a főoldalra
  },
];
