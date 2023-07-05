import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TodosState } from "./todos.state";

const selectTodoState = createFeatureSelector<TodosState>("state");

export const selectTodos = createSelector(
    selectTodoState,
    (state: TodosState) => state.todos
);

export const selectLoad = createSelector(
    selectTodoState,
    (state: TodosState) => state.isLoading
)

export const selectFail = createSelector(
    selectTodoState,
    (state: TodosState) => state.isFailure
)

export const selectAddedTodoIds = createSelector(
    selectTodoState,
    (state: TodosState) => state.addedTodoIds
)