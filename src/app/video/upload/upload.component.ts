import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth, 
    private clipsService: ClipService) {
    auth.user.subscribe(user => this.user = user)
   }

  isDragOver = false;
  file: File | null = null;
  hideForm = true;
  showAlert = false;
  alertMsg = 'Please wait, your file is beeing uploaded.'
  alertColor = 'blue';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });

  uploadForm = new FormGroup({
    title: this.title
  });

  ngOnInit(): void {
  }

  storeFile($event: Event) {
    this.showAlert = false;
    this.alertMsg = 'Please wait, your file is beeing uploaded.'
    this.alertColor = 'blue';

    this.isDragOver = false;

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null; // ?? - nullish operator. if undefined it will return null

    if(!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));

    this.hideForm = false;
  }

  uploadFile() {
    this.showAlert = true;
    this.alertMsg = 'Please wait, your file is beeing uploaded.'
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPercentage = true;
    
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    
    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100;
    });

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL()) //getDownload returns an observable which will be subscribed by switchMap.
    ).subscribe({                               //the snapshot from last() will be lose
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url
        }

        this.clipsService.createClip(clip);

        this.alertColor = 'green';
        this.alertMsg = 'File successfully uploaded';
        this.showPercentage = false;
        this.inSubmission = true;

        setTimeout(() => {
          this.hideForm = true;
        }, 2000);
      },
      error: (err) => {
        this.alertColor = 'red';
        this.alertMsg = 'An unexpected error ocurred. Please, try again later';
        this.inSubmission = false;
        this.showPercentage = false;
        console.error(err);
      }
    });


  }
}
