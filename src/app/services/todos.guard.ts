import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export const todosGuard: CanActivateFn = () => {
  if (inject(AuthenticationService).token === null) {
    return inject(Router).navigate(['/auth/login'])
  }

  return true;
};
