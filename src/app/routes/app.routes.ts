import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { TodosComponent } from '../components/todos/todos.component';
import { authGuard } from '../guards/auth.guard';

export const appRoutes: Routes = [
  { path: 'auth', loadChildren: () => authRoutes},
  { path: '', redirectTo: 'auth', pathMatch: 'full'}
];

const authRoutes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'todos', component: TodosComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
]; 