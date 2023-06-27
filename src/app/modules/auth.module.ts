import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../components/login/login.component';
import { TodosComponent } from '../components/todos/todos.component';
import { AuthRoutingModule } from '../rooters/auth-routing.module';



@NgModule({
  declarations: [
    LoginComponent,
    TodosComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
