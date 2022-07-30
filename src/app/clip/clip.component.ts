import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClipComponent implements OnInit {

  id = '';
  player?: videojs.Player;
  
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);

    this.route.params.subscribe( (params: Params) => {
      this.id = params.id;
    })
  }

}
