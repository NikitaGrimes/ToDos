import { Component, Input } from '@angular/core';
import { Todo } from 'src/app/models/todo';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule
  ]
})
export class TodoComponent {
  @Input() todo!: Todo;

}
