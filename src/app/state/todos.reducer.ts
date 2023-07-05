import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo';
import { TodosActions } from './todos.actions';

const initialState: Todo[] = [];

export const todoReducer = createReducer(
    initialState,
    on(TodosActions.retrievedTodos, (_, { todos }): Todo[] => todos),
    on(TodosActions.addTodo, (state, { todo }): Todo[] => [...state, todo]),
    on(TodosActions.updateTodo, (state, { editableTodo }) => {
        const index = state.findIndex(todo => todo.id === editableTodo.id)
        if (index === -1) return state;
        const newState = [...state];
        newState[index] = editableTodo;
        return newState;
    }),
    on(TodosActions.deleteTodo, (state, { todoId }) => state.filter(todo => todo.id !== todoId))
)