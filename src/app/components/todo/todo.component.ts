import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { selectLoad } from 'src/app/state/todos.selectors';
import * as todoActions from 'src/app/state/todos.actions';
import { Todo } from 'src/app/models/todo';
import { TodoForm } from 'src/app/models/todo-form';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    NgIf, 
    MatButtonModule, 
    MatSlideToggleModule,
    MatDialogModule,
    SpinnerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  public todoForm: FormGroup<TodoForm>;
  public isLoading$ = this.store.select(selectLoad);

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TodoComponent>,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) private data?: Todo
    ) {
      this.todoForm = this.formBuilder.group({
        todo: this.formBuilder.control(data?.todo ?? "", {nonNullable: true, validators: [Validators.required]}),
        completed: this.formBuilder.control(data?.completed ?? false, {nonNullable: true, validators: [Validators.required]})
      });
  }

  public cancel(): void {
    if (this.todoForm.pristine) return this.dialogRef.close();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: 'Are you sure? Data will not be saved!'});
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) this.dialogRef.close();
    });
  }

  public save(): void {
    if(this.todoForm.pristine) {
      this.dialogRef.close();
      return;
    }

    if (!this.data){
      const {todo, completed} = this.todoForm.getRawValue();
      this.store.dispatch(todoActions.addTodo({
        todo: todo, 
        completed: completed, 
        userId: <number>this.authService.getId,
        close: this.getCloseFunction()
      }));
    } else {
      const editableTodo: Todo = {id: this.data.id, ...this.todoForm.getRawValue(), userId: this.data.userId};
      this.store.dispatch(todoActions.updateTodo({
        todo: editableTodo, 
        close: this.getCloseFunction()
      }));
    }
  }

  private getCloseFunction = () => {
    const dialogRef = this.dialogRef;
    return () => dialogRef.close();
  }
}
