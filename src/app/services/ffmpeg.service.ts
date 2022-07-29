import { Injectable } from '@angular/core';
import { createFFmpeg } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {

  isReady = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true }); // creates an instance of the ffmpeg with logs true to debug
  }

  async init() {
    if(this.isReady) {
      return;
    }

    await this.ffmpeg.load(); // loading ffmpeg

    this.isReady = true;
  }
}
