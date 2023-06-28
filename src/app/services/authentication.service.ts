import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _token!: string | null;
  public username!: string | null;
  public id!: number | null;

  get token() {
    return this._token;
  }

  set token(token: string | null) {
    if (token) this._token = token;
  }

  public logout() {
    this._token = null;
    this.username = null;
    this.id = null;
  }
}
