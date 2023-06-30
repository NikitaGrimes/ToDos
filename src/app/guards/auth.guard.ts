import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  if (authService.token === null) {
    if (!localStorage.getItem('token')) 
      return inject(Router).navigate(['/auth/login']);

    authService.token = localStorage.getItem('token');
    authService.id = parseInt(<string>localStorage.getItem('userId'));
    return true;
  }

  return true;
};
