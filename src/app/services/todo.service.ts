import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private _todoUrl = 'https://dummyjson.com/todos';
  private _getUserTodosUrl = '/user/';

  constructor(
    private http: HttpClient
  ) { }

  public getUserTodos(userId: number): Observable<{todos: Todo[]}> {
    return this.http.get<{todos: Todo[]}>(this._todoUrl + this._getUserTodosUrl + userId);
  }
}
