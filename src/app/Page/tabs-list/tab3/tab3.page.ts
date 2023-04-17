import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Tab3Service } from './service/tab3.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  public isIOS: boolean;
  public name: string = '';
  public minutes:number = 0;
  public secondes:number = 0;
  public file:any;

  constructor(private platform: Platform, private tab3Service: Tab3Service) {
    this.isIOS = this.platform.is('ios');
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.name = this.file.name.substring(0, this.file.name.lastIndexOf('.'));

    const audio = new Audio();
    audio.src = URL.createObjectURL(this.file);

    audio.addEventListener('loadedmetadata', () => {
      this.minutes = Math.trunc(audio.duration/60);
      this.secondes = Math.trunc(audio.duration%60);
    });
  }

  uploadFiles(){
    this.tab3Service.uploadAudio(this.file);
  }
}
