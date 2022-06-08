import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(public modal: ModalService) { }

  ngOnInit(): void {
  }

  openModal($event: Event) {
    $event.preventDefault(); // it will not allow the anchor to be executed (href)

    this.modal.tooggleModal();
  }

}
