import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _loginUrl = "https://dummyjson.com/auth/login";

  constructor(
    private http: HttpClient
  ) { }

  public login(username: string, password: string): Observable<User>{
    return this.http.post<User>(this._loginUrl, {'username': username, 'password': password});
  }
}
