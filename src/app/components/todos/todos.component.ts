import { Component, OnInit } from '@angular/core';
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
import { BoolCompletedPipe } from 'src/app/pipes/bool-completed.pipe';
import { TodoComponent } from '../todo/todo.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';

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
        BoolCompletedPipe,
        TodoComponent,
        MatDialogModule,
        MatSnackBarModule,
        SpinnerComponent
    ]
})
export class TodosComponent implements OnInit {
    private addedTodoIds = new Set();
    private durationInSecond = 3;
    public todos: Todo[] = [];
    public loading = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private todoService: TodoService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {

    }

    ngOnInit(): void {
        this.loading = true;
        if (this.authService.id !== null)
            this.todoService.getUserTodos(this.authService.id).subscribe(todos => {
                this.loading = false;
                this.todos = todos});
    }

    public logout(): void {
        this.authService.logout();
        this.router.navigate(['../login'], {relativeTo: this.route});
    }

    public add(): void {
        const dialogRef = this.dialog.open(TodoComponent);
      
        dialogRef.afterClosed().subscribe((result: Todo) => {
            if (!result) return;

            this.loading = true;
            result.userId = <number>this.authService.id;
            this.todoService
                .addTodo(result)
                .pipe(catchError(() => of(null)))
                .subscribe((todo: Todo | null) => {
                    this.loading = false;
                    if (!todo) return;

                    this.todos.push(todo);
                    this.addedTodoIds.add(todo.id);
                }
            )
        });
    }

    public changeStatus(todo: Todo): void {
        if (this.addedTodoIds.has(todo.id)) {
            this.snackBar.open("You can't edit added todo!", undefined, {
                duration: this.durationInSecond * 1000
            });
            return;
        }

        const newTodo = {... todo};
        newTodo.completed = !newTodo.completed;
        this.loading = true;
        this.todoService.updateTodo(newTodo)
            .pipe(catchError(() => of(null)))
            .subscribe((editableTodo: Todo | null) => {
                this.loading = false;
                if (!editableTodo) return;

                const index = this.todos.findIndex(predicateTodo => predicateTodo.id === editableTodo.id);
                if (index !== -1){
                    this.todos[index] = editableTodo;
                }
            }
        )
    }

    public edit(todo: Todo): void {
        if (this.addedTodoIds.has(todo.id)) {
            this.snackBar.open("You can't edit added todo!", undefined, {
                duration: this.durationInSecond * 1000
            });
            return;
        }

        const dialogRef = this.dialog.open(TodoComponent, {
            data: {...todo},
        });
      
        dialogRef.afterClosed().subscribe((editableTodo: Todo) => {
            if (!editableTodo) return;

            this.loading = true;
            this.todoService.updateTodo(editableTodo)
                .pipe(catchError(() => of(null)))
                .subscribe((todo: Todo | null) => {
                    this.loading = false;
                    if (!todo) return;

                    const index = this.todos.findIndex(predicateTodo => predicateTodo.id === todo.id);
                    if (index !== -1)
                        this.todos[index] = todo;
                }
            )
        });
    }

    public delete(id: number): void {
        if (this.addedTodoIds.has(id)) {
            this.snackBar.open("You can't delete added todo!", undefined, {
                duration: this.durationInSecond * 1000
            });
            return;
        }

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: 'Are you sure?'});
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (!result) return dialogRef.close();

            this.loading = true;
            this.todoService.deleteTodo(id)
                .pipe(catchError(() => of(null)))
                .subscribe((todo: Todo | null) => {
                    this.loading = false;
                    if (!todo) return;
                    
                    const index = this.todos.findIndex(predcateTodo => predcateTodo.id === todo.id)
                    if (index !== -1)
                        this.todos.splice(index, 1);
                }
            )
        });
    }
}
