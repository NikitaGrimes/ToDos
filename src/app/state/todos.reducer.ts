import { createReducer, on } from '@ngrx/store';
import { initialState, TodosState } from './todos-state';
import * as todoActions from './todos.actions';

export const todoReducer = createReducer(
    initialState,

    on(todoActions.getTodos, (state): TodosState => ({
        ...state, 
        isLoading: true, 
        isFailure: false
    })),
    on(todoActions.getTodosSuccess, (_, result): TodosState => ({
        todos: result.todos, 
        isLoading: false, 
        isFailure: false,
        addedTodoIds: new Set()
    })),
    on(todoActions.getTodosFailure, (state): TodosState => ({
        ...state, 
        isLoading: false, 
        isFailure: true
    })),

    on(todoActions.addTodo, (state): TodosState => ({
        ...state, 
        isLoading: true, 
        isFailure: false
    })),
    on(todoActions.addTodoSuccess, (state, result): TodosState => {
        const newState = ({...state ,todos: [...state.todos, result.todo], isLoading: false, isFailure: false});
        newState.addedTodoIds.add(result.todo.id);
        return newState;
    }),
    on(todoActions.addTodoFailure, (state): TodosState => ({
        ...state, 
        isLoading: false, 
        isFailure: true
    })),

    on(todoActions.updateTodo, (state): TodosState => ({
        ...state,
        isLoading: true,
        isFailure: false
    })),
    on(todoActions.updateTodoSuccess, (state, result): TodosState => {
        const index = state.todos.findIndex(todo => todo.id === result.todo.id);
        if (index === -1) return ({...state, isLoading: false, isFailure: true});

        const newState = ({...state ,todos: [...state.todos], isLoading: false, isFailure: false});
        newState.todos[index] = result.todo;
        return newState;
    }),
    on(todoActions.updateTodoFailure, (state): TodosState => ({
        ...state, 
        isLoading: false, 
        isFailure: true
    })),

    on(todoActions.deleteTodo, (state): TodosState => ({
        ...state, 
        isLoading: true,
        isFailure: false
    })),
    on(todoActions.deleteTodoSuccess, (state, result): TodosState => ({
        ...state,
        todos: state.todos.filter(todo => todo.id !== result.todoId),
        isLoading: false,
        isFailure: false
    })),
    on(todoActions.deleteTodoFailure, (state): TodosState => ({
        ...state, 
        isLoading: false, 
        isFailure: true
    })),
)
