import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { catchError, Observable, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public hide = true;
  public incorrectInput = false;
  public loginForm!: FormGroup;
  public authorize$!: Observable<User | boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) {

  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: this.formBuilder.control('atuny0', [Validators.required]),
      password: this.formBuilder.control('9uQFF1Lh', [Validators.required])
    });
  }

  public getUsernameErrorMessage(): string{
    return "Enter your username.";
  }

  public getPasswordErrorMessage(): string{
    return "Enter your password."
  }

  public submit(): void{
    const username = this.loginForm.controls["username"].value;
    const password = this.loginForm.controls["password"].value;
    this.authorize$ = this.userService.login(username, password).pipe(catchError(() =>  of(true)));
  }

  public getInputErrorMessage(){
    return 'Incorrect username or password!';
  }
}
