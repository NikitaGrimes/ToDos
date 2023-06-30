import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string | null = null;
  private id: number | null = null;

  public get getToken(): string | null {
    return this.token
  }

  public get getId(): number | null {
    return this.id;
  }

  constructor(){
    this.token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (userId)
      this.id = parseInt(userId);
  }

  public logOut() {
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
