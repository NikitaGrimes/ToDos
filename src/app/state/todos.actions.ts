import { createActionGroup, props } from '@ngrx/store';
import { Todo } from '../models/todo';

export const TodosActions = createActionGroup({
    source: 'Todos',
    events:{
        'Add Todo': props<{todo: Todo}>(),
        'Update Todo': props<{editableTodo: Todo}>(),
        'Delete Todo': props<{todoId: number}>(),
        'Retrieved Todos': props<{todos: Todo[]}>()
    }
})