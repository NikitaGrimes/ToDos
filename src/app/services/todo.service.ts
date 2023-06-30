import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Todo } from '../models/todo';
import { makeApiUrl } from '../utils/api-url.util';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(
    private http: HttpClient
  ) { }

  public getUserTodos(userId: number): Observable<Todo[]> {
    return this.http.get<{todos: Todo[]}>(makeApiUrl(`/todos/user/${userId}`), 
      {withCredentials: true}).pipe(map(obj => obj.todos));
  }

  public addTodo(todo: string, completed: boolean, userId: number): Observable<Todo> {
    return this.http.post<Todo>(makeApiUrl('/todos/add'), 
      {todo: todo, completed: completed, userId: userId}, 
      {withCredentials: true});
  }

  public updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(makeApiUrl(`/todos/${todo.id}`),
      {todo: todo.todo, completed: todo.completed, userId: todo.userId},
      {withCredentials: true});
  }

  public deleteTodo(id: number): Observable<Todo> {
    return this.http.delete<Todo>(makeApiUrl(`/todos/${id}`), 
      {withCredentials: true});
  }
}
