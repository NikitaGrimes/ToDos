import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo';

export enum TodoActions {
    GetTodos = '[Todos] Get Todos',
    GetTodosSuccess = '[Todos] Get Todos Success',
    AddTodo = '[Todos] Add Todo',
    AddTodoSuccess = '[Todos] Add Todo Success',
    UpdateTodo = '[Todo] Update Todo',
    UpdateTodoSuccess = '[Todo] Update Todo Success',
    DeleteTodo = '[Todo] Delete Todo',
    DeleteTodoSuccess = '[Todo] Delete Todo Success',
    ActionFailure = '[Todo] Action Failure'
}

export const getTodos = createAction(TodoActions.GetTodos, props<{userId: number}>());
export const getTodosSuccess = createAction(TodoActions.GetTodosSuccess, props<{todos: Todo[]}>());

export const addTodo = createAction(TodoActions.AddTodo, props<{
    todo: string, 
    completed: boolean, 
    userId: number,
    close: () => void
}>());
export const addTodoSuccess = createAction(TodoActions.AddTodoSuccess, props<{todo: Todo}>());

export const updateTodo = createAction(TodoActions.UpdateTodo, props<{
    todo: Todo,
    close: (() => void) | null
}>());
export const updateTodoSuccess = createAction(TodoActions.UpdateTodoSuccess, props<{todo: Todo}>());

export const deleteTodo = createAction(TodoActions.DeleteTodo, props<{todoId: number}>());
export const deleteTodoSuccess = createAction(TodoActions.DeleteTodoSuccess, props<{todoId: number}>());

export const actionFailure = createAction(TodoActions.ActionFailure);

