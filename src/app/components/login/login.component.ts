import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LoginForm } from 'src/app/models/login-form';
import { Login } from 'src/app/models/login';

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
      SpinnerComponent
    ]
})
export class LoginComponent implements OnInit {
  public hide = true;
  public loginForm: FormGroup<LoginForm>;
  public loading = false;
  public error = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
    ) {
      this.loginForm = this.formBuilder.group({
        username: this.formBuilder.control('atuny0', {nonNullable: true, validators: [Validators.required]}),
        password: this.formBuilder.control('9uQFF1Lh', {nonNullable: true, validators: [Validators.required]})
      });
  }

  public ngOnInit(): void {
    this.authService.logout();
  }

  public submit(): void{
    this.error = false;
    this.loading = true;
    const formValue: Login = this.loginForm.getRawValue();
    this.userService.login(formValue)
      .pipe(catchError(() => of(null)))
      .subscribe((result: User | null) => {
        this.loading = false;
        if (result) {
          this.login(result);
        } else this.error = true;
    })
  }

  private login(user: User) {
    this.authService.logIn(user);
    this.router.navigate(['../todos'], {relativeTo: this.route});
  }
}
