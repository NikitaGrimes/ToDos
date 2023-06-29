import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { TodosComponent } from '../components/todos/todos.component';
import { todosGuard } from '../guards/todos.guard';
import { AuthInterceptor } from '../models/auth-interceptor';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'todos', component: TodosComponent, canActivate: [todosGuard], providers:[{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]},
  { path: '', redirectTo: 'login', pathMatch: 'full'}
];
