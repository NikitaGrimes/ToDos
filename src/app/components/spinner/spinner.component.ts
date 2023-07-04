import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  template: '<mat-spinner class="spinner"></mat-spinner>',
  styleUrls: ['./spinner.component.scss'],
  imports: [MatProgressSpinnerModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {

}
