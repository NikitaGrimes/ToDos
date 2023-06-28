import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { Todo } from 'src/app/models/todo';
import { TodoService } from 'src/app/services/todo.service';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BoolCompletedPipe } from 'src/app/pipes/bool-completed.pipe';

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
        BoolCompletedPipe
    ]
})
export class TodosComponent implements OnInit, OnDestroy {
    public todos: Todo[] | null = null;
    private subscriptions: Subscription[] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private todoService: TodoService
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
        const todo = {id: 1, todo: "somtext", completed: false} as Todo;
        this.todoService.addTodo(todo);
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
