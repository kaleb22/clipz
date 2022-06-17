import { Component } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/modals/user.modal';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private auth: AuthService, private emailTaken: EmailTaken) { }

  inSubmission = false;
  showAlert = false;
  alertMessage = 'Please wait, your account is being created.'
  alertColor = 'blue';

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
  ]);
  confirmPassword = new FormControl('', [
    Validators.required
  ]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.maxLength(15),
    Validators.minLength(15)
  ])

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password', 'confirmPassword')]);

  async register() {
    this.showAlert = true;
    this.alertMessage = 'Please wait, your account is being created.'
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.createUser(this.registerForm.value as IUser);
    } catch (err) {
      console.error(err);

      if( err instanceof FirebaseError) {
        this.alertMessage = err.message;  
      } else {
        this.alertMessage = 'An unexpected error ocurred. Please try again later';
      }

      this.alertColor = 'red';
      this.inSubmission = false;
      return
    }

    this.alertMessage = 'Sucess!! Your account has been created';
    this.alertColor = 'green';
  }
}
