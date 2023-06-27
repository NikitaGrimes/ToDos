import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginUrl = "https://dummyjson.com/auth/login";

  constructor(
    private http: HttpClient
  ) { }

  public login(username: string, password: string): Observable<User | boolean>{
    return this.http.post<User | boolean>(this.loginUrl, {'username': username, 'password': password});
  }
}
