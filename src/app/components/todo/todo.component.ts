import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
import { Todo } from 'src/app/models/todo';
import { TodoForm } from 'src/app/models/todo-form';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TodoService } from 'src/app/services/todo.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    NgIf, 
    MatButtonModule, 
    MatSlideToggleModule,
    MatDialogModule,
    MatSnackBarModule,
    SpinnerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  public todoForm: FormGroup<TodoForm>;
  public loading = false;
  private durationInSecond = 3;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TodoComponent>,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private todoService: TodoService,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
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

    this.loading = true;
    if (!this.data){
      <number>this.authService.getId;
      const {todo, completed} = this.todoForm.getRawValue();
      this.todoService.addTodo(todo, completed, <number>this.authService.getId)
        .pipe(catchError(() => of(null)))
        .subscribe((todo: Todo | null) => {
          this.updateData(todo);
        }
      )
    } else{
      const editableTodo: Todo = {id: this.data.id, ...this.todoForm.getRawValue(), userId: this.data.userId};
      this.todoService.updateTodo(editableTodo)
        .pipe(catchError(() => of(null)))
        .subscribe((todo: Todo | null) => {
          this.updateData(todo);
      })
    }
  }

  private updateData(todo: Todo | null): void{
    this.loading = false;
    if (todo) {
      this.dialogRef.close(todo);
      return;
    }

    this.snackBar.open("Oops... Something's wrong. Try again.", undefined, {
      duration: this.durationInSecond * 1000
    });
    this.changeDetector.detectChanges();
  }
}
