import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { TodosComponent } from '../components/todos/todos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'todos', component: TodosComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full'}
];
