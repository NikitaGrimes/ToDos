import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { LoginForm } from '../models/login-form';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginUrl = "https://dummyjson.com/auth/login";

  constructor(
    private http: HttpClient
  ) { }

  public login(form: Login): Observable<User>{
    return this.http.post<User>(this.loginUrl, {username: form.username, password: form.password});
  }
}
