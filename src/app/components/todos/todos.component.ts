import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
        MatProgressSpinnerModule
    ]
})
export class TodosComponent implements OnInit, OnDestroy {
    public todos: Todo[] | null = null;
    private subscriptions: Subscription[] = [];
    private addedTodoIds = new Set();
    public loading = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private todoService: TodoService,
        private dialog: MatDialog
    ) {

    }

    ngOnInit(): void {
        this.loading = true;
        if (this.authService.id !== null)
            this.subscriptions.push(this.todoService.getUserTodos(this.authService.id).subscribe(todos => {
                this.loading = false;
                this.todos = todos
            }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscriotion => subscriotion.unsubscribe());
    }

    public logout(): void {
        this.authService.logout();
        this.router.navigate(['../login'], {relativeTo: this.route});
    }

    public add(): void {
        const dialogRef = this.dialog.open(TodoComponent, {
            data: null,
        });
      
        dialogRef.afterClosed().subscribe((result: Todo) => {
            if (!result) return;

            result.userId = <number>this.authService.id;
            console.log(result);
        });
    }

    public changeStatus(todo: Todo): void {
        const newTodo = {... todo};
        newTodo.completed = !newTodo.completed;
        console.log(newTodo);
    }

    public edit(todo: Todo): void {
        if (this.addedTodoIds.has(todo.id)) return;

        const dialogRef = this.dialog.open(TodoComponent, {
            data: {...todo},
        });
      
        dialogRef.afterClosed().subscribe((result: Todo) => {
            if (result) console.log(result);
        });
    }

    public delete(id: number): void {
        if (this.addedTodoIds.has(id)) return;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: 'Are you sure?'});
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (!result) return dialogRef.close();

            console.log(id);
        });
    }
}
