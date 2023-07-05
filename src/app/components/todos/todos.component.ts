import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatButtonModule } from '@angular/material/button';
import { Todo } from 'src/app/models/todo';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { TodoComponent } from '../todo/todo.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatSlideToggleModule, MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectFail, selectLoad, selectTodos } from 'src/app/state/todos.selectors';
import * as todoActions from 'src/app/state/todos.actions';

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
export class TodosComponent implements OnInit, OnDestroy {
    private durationInSecond = 3;
    public isLoading$ = this.store.select(selectLoad);
    public todos$ = this.store.select(selectTodos);
    private isFailure$ = this.store.select(selectFail);
    private subscription: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private store: Store
    ) {
        this.subscription = this.isFailure$.subscribe((isFail: boolean) => {
            if(isFail)
                this.snackBar.open("Oops... Something's wrong. Try again.", undefined, {
                    duration: this.durationInSecond * 1000
                });
        })
    }

    public ngOnInit(): void {
        this.store.dispatch(todoActions.getTodos({userId: <number>this.authService.getId}));
    }
    
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public logout(): void {
        this.authService.logOut();
        this.router.navigate(['../login'], {relativeTo: this.route});
    }

    public add(): void {
        this.dialog.open(TodoComponent);
    }

    public changeStatus(todo: Todo): void {
        const newTodo = {...todo};
        newTodo.completed = !newTodo.completed;
        this.store.dispatch(todoActions.updateTodo({todo: newTodo, close: null}));
    }

    public edit(todo: Todo): void {
        this.dialog.open(TodoComponent, {
            data: todo,
        });
    }

    public delete(id: number): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: 'Are you sure?'});
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (!result) return dialogRef.close();

            this.store.dispatch(todoActions.deleteTodo({todoId: id}));
        });
    }
}
