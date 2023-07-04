import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Todo } from "../models/todo";

const selectTodoState = createFeatureSelector<Todo[]>("todo");

export const selectTodos = createSelector(
    selectTodoState,
    (state: Todo[]) => state
);