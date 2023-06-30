import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public token: string | null = null;
  public id: number | null = null;

  public logout() {
    this.token = null;
    this.id = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  public logIn(user: User): void{
    this.token = user.token;
    this.id = user.id;
    localStorage.setItem('token', user.token);
    localStorage.setItem('userId', user.id.toString());
  }
}
