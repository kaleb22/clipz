import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isRunning = false;
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
    this.isRunning = true;
    const data = await fetchFile(file);

    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds = [0, 1];
    const commands: string[] = []

    seconds.forEach(second => {
      commands.push(
      '-i', file.name,
      '-ss', `00:00:0${second}`,
      '-frames:v', '1',
      '-filter:v', 'scale=510:-1',
      `output_0${second}.png`
      )
    })

    await this.ffmpeg.run(
      ...commands
    );

    const screnshots: string[] = [];

    seconds.forEach(second => {
      const screenShotFile = this.ffmpeg.FS('readFile', `output_0${second}.png`)
      const screenShotBlob = new Blob(
        [screenShotFile.buffer], {
          type: 'image/png'
        }
      )

      const screenShotURL = URL.createObjectURL(screenShotBlob);
      screnshots.push(screenShotURL);
    })

    this.isRunning = false;
    return screnshots;
  }

    // input
    //'-i', file.name, // process the file
    // output options
    //'-ss', '00:00:01', // get frame from time stamp
    //'-frames:v', '1', // generate 1 frame
    //'-filter:v', 'scale=510:-1', // maintain the aspect-ratio of file
    // output
    //'output_01.png' // generate the image with this name
}
