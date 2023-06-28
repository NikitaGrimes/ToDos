import { Component, Input } from '@angular/core';
import { Todo } from 'src/app/models/todo';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BoolCompletedPipe } from 'src/app/pipes/bool-completed.pipe';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    BoolCompletedPipe
  ]
})
export class TodoComponent {
  @Input() todo!: Todo;

}
