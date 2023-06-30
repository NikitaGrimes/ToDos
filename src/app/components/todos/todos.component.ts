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
import { TodoComponent } from '../todo/todo.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

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
        FormsModule,
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

    public ngOnInit(): void {
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
        dialogRef.afterClosed().subscribe((result: Todo | null) => {
            if (!result) return;
            
            this.todos.push(result);
            this.addedTodoIds.add(result.id);
        });
    }

    public changeStatus(todo: Todo): void {
        if (this.checkAddedTodo(todo.id, "You can't edit added todo!")) return;

        this.loading = true;
        this.todoService.updateTodo(todo)
            .pipe(catchError(() => of(null)))
            .subscribe((editableTodo: Todo | null) => {
                this.loading = false;
                if (editableTodo) return;

                todo.completed = !todo.completed;
                this.snackBar.open("Oops... Something's wrong. Try again.", undefined, {
                    duration: this.durationInSecond * 1000
                });
            }
        ) 
    }

    public edit(todo: Todo): void {
        if (this.checkAddedTodo(todo.id, "You can't edit added todo!")) return;

        const dialogRef = this.dialog.open(TodoComponent, {
            data: todo,
        });
      
        dialogRef.afterClosed().subscribe((editableTodo: Todo | null) => {
            if (!editableTodo) return;

            const index = this.todos.findIndex(predicateTodo => predicateTodo.id === editableTodo.id);
            if (index !== -1)
                this.todos[index] = editableTodo;
        });
    }

    public delete(id: number): void {
        if (this.checkAddedTodo(id, "You can't delete added todo!")) return;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: 'Are you sure?'});
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (!result) return dialogRef.close();

            this.loading = true;
            this.todoService.deleteTodo(id)
                .pipe(catchError(() => of(null)))
                .subscribe((todo: Todo | null) => {
                    this.loading = false;
                    if (!todo) {
                        this.snackBar.open("Oops... Something's wrong. Try again.", undefined, {
                            duration: this.durationInSecond * 1000
                        });
                        return;
                    }
                    
                    const index = this.todos.findIndex(predicateTodo => predicateTodo.id === todo.id)
                    if (index !== -1)
                        this.todos.splice(index, 1);
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
