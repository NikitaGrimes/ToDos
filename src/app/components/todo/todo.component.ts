import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Todo } from 'src/app/models/todo';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    MatDialogModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnInit {
  public form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TodoComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Todo
    ) {
  }

  ngOnInit(): void {
    if (!this.data) this.data = {todo: "", completed: false} as Todo;

    this.form = this.formBuilder.group({
      todo: this.formBuilder.control(this.data.todo, {validators:[Validators.required]}),
      completed: this.formBuilder.control(this.data.completed)
    });
  }

  public getTodoErrorMessage(): string{
    return 'Enter your todo.';
  }

  public cansel(): void {
    if (this.form.pristine) return this.dialogRef.close();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: 'Are you sure? Data will not be saved!'});
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) this.dialogRef.close();
    });
  }

  public save(): void {
    this.data.todo = this.form.getRawValue().todo;
    this.data.completed = this.form.getRawValue().completed;
    this.dialogRef.close(this.data);
  }
}
