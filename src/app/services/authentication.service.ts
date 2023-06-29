import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _token: string | null = null;
  public id: number | null = null;

  get token() {
    return this._token;
  }

  public logout() {
    this._token = null;
    this.id = null;
  }

  public logIn(user: User): void{
    this._token = user.token;
    this.id = user.id;
  }
}
