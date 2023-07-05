import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './app/services/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { todoReducer } from './app/state/todos.reducer';
import { provideEffects } from '@ngrx/effects';
import { TodoEffects } from './app/state/todos.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ "state": todoReducer }),
    provideEffects(TodoEffects)
],
})
