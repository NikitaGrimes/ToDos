import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = () => {
  if (inject(AuthenticationService).getToken === null)
    return inject(Router).navigate(['/auth/login']);

  return true;
};
