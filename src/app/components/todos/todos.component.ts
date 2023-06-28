import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatButtonModule } from '@angular/material/button';
import { map, Observable, tap } from 'rxjs';
import { Todo } from 'src/app/models/todo';
import { TodoService } from 'src/app/services/todo.service';
import { CommonModule } from '@angular/common';
import { TodoComponent } from '../todo/todo.component';

@Component({
    selector: 'app-todos',
    templateUrl: './todos.component.html',
    styleUrls: ['./todos.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        CommonModule,
        TodoComponent
    ]
})
export class TodosComponent implements OnInit {
    public todos$!: Observable<Todo[]>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private todoService: TodoService
    ) {

    }

    ngOnInit(): void {
        if (this.authService.id !== null)
            this.todos$ = this.todoService.getUserTodos(this.authService.id).pipe(map(obj => obj.todos));
    }

    logout(){
        this.authService.logout();
        this.router.navigate(['../login'], {relativeTo: this.route});
    }
}
