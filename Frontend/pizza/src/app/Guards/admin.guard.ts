import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SessionService } from '../Services/session.service';
import { Role } from '../Interfaces/User';

export const adminGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  // Ellenőrizzük, hogy be van-e jelentkezve a felhasználó
  if (sessionService.isLoggedIn()) {
    const user = sessionService.getUser();

    // Ellenőrizzük, hogy admin-e a felhasználó
    if (sessionService.isAdmin()) {
      return true;
    }

    // Ha be van jelentkezve, de nem admin -> főoldal
    alert('Nincs jogosultságod az admin felület eléréséhez!');
    router.navigate(['']);
    return false;
  }

  // Ha nincs bejelentkezve -> login oldalra
  alert('Kérlek jelentkezz be!');
  router.navigate(['/bejelentkezes'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};
