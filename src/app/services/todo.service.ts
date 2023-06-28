import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoUrl = 'https://dummyjson.com/todos';
  private getUserTodosUrl = '/user/';

  constructor(
    private http: HttpClient
  ) { }

  public getUserTodos(userId: number): Observable<Todo[]> {
    return this.http.get<{todos: Todo[]}>(this.todoUrl + this.getUserTodosUrl + userId, {headers:{auth:'true'}}).pipe(map(obj => obj.todos));
  }

  public addTodo(todo: Todo): void {
    console.log(todo);
  }
}
