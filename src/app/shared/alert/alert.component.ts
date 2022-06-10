import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor() { }

  @Input() color = 'blue';

  ngOnInit(): void {
  }

  get bgColor() {
    return `bg-${this.color}-400`;
  }

}
