import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PizzaMegjelenitComponent } from './Components/pages/pizza/pizza-megjelenit/pizza-megjelenit.component';
import { PizzaFelveszComponent } from './Components/pages/pizza/pizza-felvesz/pizza-felvesz.component';
import { RegistrationComponent } from './Components/pages/registration/registration.component';
import { LoginComponent } from './Components/pages/login/login.component';
import { LandingPageComponent } from './Components/pages/landing-page/landing-page.component';
import { ProfileOverviewComponent } from './Components/user/profile-overview/profile-overview.component';
import { ShoppingCartComponent } from './Components/shopping-cart/shopping-cart.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },

  {
    path: 'pizzak',
    component: PizzaMegjelenitComponent,
  },
  {
    path: 'pizzak/felvesz',
    component: PizzaFelveszComponent,
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
  },
  {
    path: 'kosar',
    component: ShoppingCartComponent,
  },
];
