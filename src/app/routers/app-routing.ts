import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth.routing').then(m => m.routes)},
  { path: '', redirectTo: 'auth', pathMatch: 'full'}
];

export class AppRouting { }
