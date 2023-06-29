import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { TodosComponent } from '../components/todos/todos.component';
import { todosGuard } from '../guards/todos.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'todos', component: TodosComponent, canActivate: [todosGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full'}
];
