import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth, 
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe(user => this.user = user)
    this.ffmpegService.init();
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
  task?: AngularFireUploadTask;
  screenshots: string[] = [];

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

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile($event: Event) {

    if(this.ffmpegService.isRunning) {
      return;
    }
    
    
    this.showAlert = false;
    this.alertMsg = 'Please wait, your file is beeing uploaded.'
    this.alertColor = 'blue';

    this.isDragOver = false;

    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null : // ?? - nullish operator. if undefined it will return null
      ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if(!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenShots(this.file);

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));

    this.hideForm = false;
  }

  uploadFile() {
    this.uploadForm.disable(); // disables the form to prevent user interaction

    this.showAlert = true;
    this.alertMsg = 'Please wait, your file is beeing uploaded.'
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPercentage = true;
    
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    this.task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100;
    });

    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL()) //getDownload returns an observable which will be subscribed by switchMap.
    ).subscribe({                               //the snapshot from last() will be lose
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        const clipDocRef = await this.clipsService.createClip(clip);
        
        this.alertColor = 'green';
        this.alertMsg = 'File successfully uploaded';
        this.showPercentage = false;
        this.inSubmission = true;
        
        setTimeout(() => {
          this.router.navigate(['clip', clipDocRef.id])
        }, 2000);
      },
      error: (err) => {
        this.uploadForm.enable(); // enables the form in case of an error
        this.alertColor = 'red';
        this.alertMsg = 'An unexpected error ocurred. Please, try again later';
        this.inSubmission = false;
        this.showPercentage = false;
        console.error(err);
      }
    });
  }
}
