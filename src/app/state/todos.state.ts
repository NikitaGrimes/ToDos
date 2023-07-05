import { Todo } from "../models/todo";

export interface TodosState {
    todos: Todo[];
    addedTodoIds: Set<number>;
    isLoading: boolean;
    isFailure: boolean;
}

export const initialState: TodosState = {
    todos: [],
    addedTodoIds: new Set(),
    isLoading: false,
    isFailure: false
}