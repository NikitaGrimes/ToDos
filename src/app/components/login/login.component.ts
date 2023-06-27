import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public hide = true;
  public loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder){

  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control('', [Validators.required])
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
    
  }
}
