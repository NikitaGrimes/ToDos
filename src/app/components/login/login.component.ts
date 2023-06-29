import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, Observable, of, share, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
      FormsModule, 
      ReactiveFormsModule, 
      MatFormFieldModule, 
      MatInputModule, 
      NgIf, 
      MatButtonModule, 
      MatIconModule, 
      AsyncPipe,
      MatProgressSpinnerModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  public hide = true;
  public loginForm!: FormGroup;
  public authorize$: Observable<User | boolean> = of(false);

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
    ) {

  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: this.formBuilder.control('atuny0', [Validators.required]),
      password: this.formBuilder.control('9uQFF1Lh', [Validators.required])
    });
  }

  public getUsernameErrorMessage(): string {
    return "Enter your username.";
  }

  public getPasswordErrorMessage(): string {
    return "Enter your password."
  }

  public getInputErrorMessage() {
    return 'Incorrect username or password!';
  }

  public submit(): void{
    const username = this.loginForm.getRawValue().username;
    const password = this.loginForm.getRawValue().password;
    this.authorize$ = this.userService.login(username, password).pipe(
      tap(result => {
        this.login(result as User);
      }), 
      catchError(() =>  of(true)), 
      share()
    );
  }

  private login(user: User) {
    this.authService.token = user.token;
    this.authService.username = user.username;
    this.authService.id = user.id;
    this.router.navigate(['../todos'], {relativeTo: this.route});
  }
}
