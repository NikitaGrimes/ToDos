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
    ]
})
export class TodosComponent implements OnInit, OnDestroy {
    public todos: Todo[] | null = null;
    private subscriptions: Subscription[] = [];
    editableTodo: Todo | null = null

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private todoService: TodoService,
        private dialog: MatDialog
    ) {

    }

    ngOnInit(): void {
        if (this.authService.id !== null)
            this.subscriptions.push(this.todoService.getUserTodos(this.authService.id).subscribe(todos => this.todos = todos));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscriotion => subscriotion.unsubscribe());
    }

    public logout() {
        this.authService.logout();
        this.router.navigate(['../login'], {relativeTo: this.route});
    }

    public add(): void {
        this.editableTodo = {todo: "", completed: false} as Todo;
        const dialogRef = this.dialog.open(TodoComponent, {
            data: this.editableTodo,
        });
      
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    public changeStatus(id: number): void {
        console.log("change", id);
    }

    public edit(id: number): void {
        console.log("edit", id);
    }

    public delete(id: number): void {
        console.log("delete", id);
    }
}
