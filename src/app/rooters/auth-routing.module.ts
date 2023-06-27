import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { TodosComponent } from '../components/todos/todos.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'todos', component: TodosComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
