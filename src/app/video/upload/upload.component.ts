import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor() { }

  isDragOver = false;
  file: File | null = null;
  hideForm = true;

  ngOnInit(): void {
  }

  storeFile($event: Event) {
    this.isDragOver = false;

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null; // ?? - nullish operator. if undefined it will return null

    if(!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.hideForm = false;
  }

}
