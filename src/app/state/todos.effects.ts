import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, mergeMap, map, of } from "rxjs";
import { TodoService } from "../services/todo.service";
import * as todoActions from "./todos.actions";
import { selectAddedTodoIds } from "./todos.selectors"

@Injectable()
export class TodoEffects {
    constructor(
        private action$: Actions,
        private todoService: TodoService,
        private store: Store
    ){

    }

    getTodos$ = createEffect(() => {
        return this.action$.pipe(
            ofType(todoActions.getTodos),
            mergeMap(action => 
                this.todoService.getUserTodos(action.userId).pipe(
                    map(response =>  todoActions.getTodosSuccess({todos: response})),
                    catchError(() => of(todoActions.actionFailure()))
                )
            )
        )
    });

    addTodo$ = createEffect(() => {
        return this.action$.pipe(
            ofType(todoActions.addTodo),
            mergeMap(action => 
                this.todoService.addTodo(action.todo, action.completed, action.userId).pipe(
                    map(response => {
                        action.close();
                        return todoActions.addTodoSuccess({todo: response});
                    }),
                    catchError(() => of(todoActions.actionFailure()))
                )
            )
        )
    });

    updateTodo$ = createEffect(() => {
        return this.action$.pipe(
            ofType(todoActions.updateTodo),
            concatLatestFrom(() => this.store.select(selectAddedTodoIds)),
            mergeMap(([action, addedTodoIds]) => {
                if (addedTodoIds.has(action.todo.id)){
                    action.close?.();
                    return of(todoActions.actionFailure());
                }
                return this.todoService.updateTodo(action.todo).pipe(
                    map(response => {
                        action.close?.();
                        return todoActions.updateTodoSuccess({todo: response});
                    }),
                    catchError(() => of(todoActions.actionFailure()))
                )
            })
        )
    });

    deleteTodo$ = createEffect(() => {
        return this.action$.pipe(
            ofType(todoActions.deleteTodo),
            concatLatestFrom(() => this.store.select(selectAddedTodoIds)),
            mergeMap(([action, addedTodoIds]) => {
                if (addedTodoIds.has(action.todoId))
                    return of(todoActions.actionFailure());

                return this.todoService.deleteTodo(action.todoId).pipe(
                    map(response => todoActions.deleteTodoSuccess({todoId: response.id})),
                    catchError(() => of(todoActions.actionFailure()))
                )
            })
        )
    })
}