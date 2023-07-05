import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatButtonModule } from '@angular/material/button';
import { Todo } from 'src/app/models/todo';
import { TodoService } from 'src/app/services/todo.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { TodoComponent } from '../todo/todo.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatSlideToggleModule, MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectTodos } from 'src/app/state/todos.selectors';
import { TodosActions } from 'src/app/state/todos.actions';

@Component({
    selector: 'app-todos',
    templateUrl: './todos.component.html',
    styleUrls: ['./todos.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        CommonModule,
        MatDividerModule,
        MatIconModule,
        MatCardModule,
        TodoComponent,
        MatDialogModule,
        MatSnackBarModule,
        SpinnerComponent,
        MatSlideToggleModule,
        FormsModule
    ],
    providers:[
        {provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS , useValue: {disableToggleValue: true}}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosComponent implements OnInit {
    private addedTodoIds = new Set();
    private durationInSecond = 3;
    public loading = false;
    public todos$ = this.store.select(selectTodos);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private todoService: TodoService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private changeDetector: ChangeDetectorRef,
        private store: Store
    ) {
        
    }

    public ngOnInit(): void {
        this.loading = true;
        this.todoService.getUserTodos(<number>this.authService.getId)
            .pipe(catchError(() => of(null)))
            .subscribe((todos: Todo[] | null) => {
                this.loading = false;
                if (todos)
                    this.store.dispatch(TodosActions.retrievedTodos({ todos }));
                else {
                    this.snackBar.open("Oops... Something's wrong. Try again.", undefined, {
                        duration: this.durationInSecond * 1000
                    });
                    this.changeDetector.detectChanges();
                }
            }
        )
    }

    public logout(): void {
        this.authService.logOut();
        this.router.navigate(['../login'], {relativeTo: this.route});
    }

    public add(): void {
        const dialogRef = this.dialog.open(TodoComponent);
        dialogRef.afterClosed().subscribe((result: Todo | null) => {
            if (!result) return;

            this.store.dispatch(TodosActions.addTodo({ todo: result }));
            this.addedTodoIds.add(result.id);
        });
    }

    public changeStatus(todo: Todo): void {
        if (this.checkAddedTodo(todo.id, "You can't edit added todo!"))
            return;

        this.loading = true;
        this.changeDetector.detectChanges();
        const newTodo = {...todo};
        newTodo.completed = !newTodo.completed;
        this.todoService.updateTodo(newTodo)
            .pipe(catchError(() => of(null)))
            .subscribe((editableTodo: Todo | null) => {
                this.loading = false;
                if (editableTodo) {
                    this.store.dispatch(TodosActions.updateTodo({ editableTodo }));
                    return;
                }

                this.changeDetector.detectChanges();
                this.snackBar.open("Oops... Something's wrong. Try again.", undefined, {
                    duration: this.durationInSecond * 1000
                    }
                );
            }
        )
    }

    public edit(todo: Todo): void {
        if (this.checkAddedTodo(todo.id, "You can't edit added todo!")) return;

        const dialogRef = this.dialog.open(TodoComponent, {
            data: todo,
        });
      
        dialogRef.afterClosed().subscribe((editableTodo: Todo | null) => {
            if (editableTodo) 
                this.store.dispatch(TodosActions.updateTodo({ editableTodo }));
        });
    }

    public delete(id: number): void {
        if (this.checkAddedTodo(id, "You can't delete added todo!")) return;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: 'Are you sure?'});
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (!result) return dialogRef.close();

            this.loading = true;
            this.changeDetector.detectChanges();
            this.todoService.deleteTodo(id)
                .pipe(catchError(() => of(null)))
                .subscribe((todo: Todo | null) => {
                    this.loading = false;
                    if (!todo) {
                        this.snackBar.open("Oops... Something's wrong. Try again.", undefined, {
                            duration: this.durationInSecond * 1000
                        });
                        this.changeDetector.detectChanges();
                        return;
                    }
                    
                    this.store.dispatch(TodosActions.deleteTodo({ todoId: todo.id }));
                }
            )
        });
    }

    private checkAddedTodo(id: number, message: string): boolean{
        if (this.addedTodoIds.has(id)) {
            this.snackBar.open(message, undefined, {
                duration: this.durationInSecond * 1000
            });
            return true;
        }

        return false;
    }
}
