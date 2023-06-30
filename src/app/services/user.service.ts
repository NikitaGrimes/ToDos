import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { User } from '../models/user';
import { makeApiUrl } from '../utils/api-url.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient
  ) { }

  public login(form: Login): Observable<User>{
    return this.http.post<User>(makeApiUrl('/auth/login'), {username: form.username, password: form.password});
  }
}
