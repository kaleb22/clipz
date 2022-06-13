import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  credentials = {
    email: '',
    password: ''
  }

  ngOnInit(): void {
  }

  signIn(): void {
    console.log(this.credentials);
  }

}
