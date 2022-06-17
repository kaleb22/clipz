import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    public modal: ModalService, 
    public auth: AuthService, 
    private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  openModal($event: Event) {
    $event.preventDefault(); // it will not allow the anchor to be executed (href)

    this.modal.tooggleModal('auth');
  }
}
