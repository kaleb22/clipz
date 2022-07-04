import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/modals/clip.modal';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  
  videoOrder = 'd'; // descending asceding
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private clipService: ClipService,
    private modal: ModalService
  ) {
      this.sort$ = new BehaviorSubject(this.videoOrder);
     }


  ngOnInit(): void {
    this.route.queryParamMap.subscribe( (params: Params) => {
      this.videoOrder = params.sort === 'd' ? params.sort : 'a';
      this.sort$.next(this.videoOrder);
    });

    this.clipService.getUserClips(this.sort$).subscribe(docsList => {
      this.clips = [];

      docsList.forEach(doc => {
        this.clips.push({
          docId: doc.id,
          ...doc.data() // spreed operator merges the doc properties with this new obj
        })
      })
    })
  }

  sort(event: Event): void {
    const { value } = ( event.target as HTMLSelectElement );
    this.sort$.next(value);
    //this.router.navigateByUrl(`/manage?sort=${value}`);
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();

    this.activeClip = clip;
    this.modal.tooggleModal('editClip');
  }

  update($event: IClip) {
    
    this.clips.forEach((clip, index) => {
      if(clip.docId == $event.docId) {
        this.clips[index].title = $event.title;
      }
    })
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    this.clipService.deleteClip(clip);
    this.clips.forEach( (el, index) => {
      if(el.docId == clip.docId) {
        this.clips.splice(index, 1);
      }
    })
  }

}
