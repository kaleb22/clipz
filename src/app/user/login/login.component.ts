import { Component } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private auth: AngularFireAuth) { }

  credentials = {
    email: '',
    password: ''
  }

  inSubmission = false;
  showAlert = false;
  alertMessage = 'Please wait, trying to signing you in.'
  alertColor = 'blue';

  async signIn() {
    this.inSubmission = true;
    this.showAlert = true;

    try {
     await this.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password);
    } catch (err) {
      this.alertMessage = 'Your credentials are invalid. Try again.';

      this.alertColor = 'red';
      this.inSubmission = false;
      return
    }

    this.alertMessage = 'Sucess!! You sucessfully logged in.';
    this.alertColor = 'green';
  }
}
