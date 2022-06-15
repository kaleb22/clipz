import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseError } from '@angular/fire/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  //injecting angularFire services
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) { }

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
  ]);
  age = new FormControl('', [
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
  });

  async register() {
    this.showAlert = true;
    this.alertMessage = 'Please wait, your account is being created.'
    this.alertColor = 'blue';
    this.inSubmission = true;

    //using destruction syntax
    const { email, password } = this.registerForm.value;

    try {
      //using ! (not null operator) to ensure typescript that email and password will always be string.
      const userCredential = await this.auth.createUserWithEmailAndPassword(email!, password!);
      console.log(userCredential);
      
      await this.db.collection('users').add({
        name: this.name.value,
        email: this.email.value,
        age: this.age.value,
        phoneNumber: this.phoneNumber.value
      });


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
