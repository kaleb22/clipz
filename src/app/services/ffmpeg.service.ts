import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

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

  async getScreenShots(file: File) {
    const data = await fetchFile(file);

    this.ffmpeg.FS('writeFile', file.name, data);

    await this.ffmpeg.run(
      // input
      '-i', file.name, // process the file
      // output options
      '-ss', '00:00:01', // get frame from time stamp
      '-frames:v', '1', // generate 1 frame
      '-filter:v', 'scale=510:-1', // maintain the aspect-ratio of file
      // output
      'output_01.png' // generate the image with this name
    );
  }
}
