import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoUrl = 'https://dummyjson.com/todos/';
  private getUserTodosUrl = 'user/';
  private addTodoUrl = 'add';

  constructor(
    private http: HttpClient
  ) { }

  public getUserTodos(userId: number): Observable<Todo[]> {
    return this.http.get<{todos: Todo[]}>(this.todoUrl + this.getUserTodosUrl + userId, 
      {headers: {auth:'true'}}).pipe(map(obj => obj.todos));
  }

  public addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.todoUrl + this.addTodoUrl, 
      {todo: todo.todo, completed: todo.completed, userId: todo.userId}, 
      {headers: {auth: 'true'}});
  }

  public updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(this.todoUrl + todo.id,
      {todo: todo.todo, completed: todo.completed, userId: todo.userId},
      {headers: {auth: 'true'}});
  }

  public deleteTodo(id: number): Observable<Todo> {
    return this.http.delete<Todo>(this.todoUrl + id, 
      {headers: {auth:'true'}});
  }
}
