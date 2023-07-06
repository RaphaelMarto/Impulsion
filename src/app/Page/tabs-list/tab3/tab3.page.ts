import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Tab3Service } from './service/tab3.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import WaveSurfer from 'wavesurfer.js';
import * as WaveSurferTimeline from 'wavesurfer.js/src/plugin/timeline';
import * as WaveSurferRegion from 'wavesurfer.js/src/plugin/regions';
import * as Minimap from 'wavesurfer.js/src/plugin/minimap';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  public isIOS: boolean;
  public name: string = '';
  public minutes: number = 0;
  public secondes: number = 0;
  public file: any;
  public genre: any[] = [];
  musicForm!: FormGroup<any>;
  audioFile: any;
  audioDuration: any;
  wave: any;
  duration: number = 0;
  dragging: boolean = false;
  condition: boolean = false;
  sending: boolean = false;

  @ViewChild('waveform', { static: false }) waveformcontainer!: ElementRef;

  constructor(
    private platform: Platform,
    private tab3Service: Tab3Service,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.isIOS = this.platform.is('ios');
  }

  ngOnInit(): void {
    this.tab3Service.getGenre().subscribe((data) => {
      this.genre = data;
    });
  }

  async presentLoading(): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingController.create({
      message: 'Uploading file...',
    });
    await loading.present();
    return loading;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'File uploaded successfully.',
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0] as File;
    event.target.value = '';
    this.name = this.file.name.substring(0, this.file.name.lastIndexOf('.') > 20 ? 20 : this.file.name.lastIndexOf('.'));
    this.condition = true;

    const audio = new Audio();
    audio.src = URL.createObjectURL(this.file);

    audio.addEventListener('loadedmetadata', () => {
      this.duration = audio.duration;
    });

    this.musicForm = this.formBuilder.group({
      name: [this.name, [Validators.required, Validators.maxLength(20)]],
      genre: new FormControl('', Validators.required),
      desc: ['', Validators.required],
    });
    this.cdr.detectChanges();
    this.audioPlayerCreate();
  }

  async exportSelected() {
    const region: any = Object.values(this.wave.regions.list)[0];
    console.log(this.file)
    if (region) {
      const start = region.start;
      const end = region.end;
      const newFile = new File([this.file.slice((start * 44100) / 2, (end * 44100) / 2)], this.file.name, {
        type: this.file.type,
        lastModified: this.file.lastModified,
      });
      console.log(newFile)
      this.file = '';
      return newFile;
    } else {
      console.log('No region selected.');
      return null;
    }
  }

  audioPlayerCreate() {
    this.audioFile = URL.createObjectURL(this.file);
    this.wave = WaveSurfer.create({
      container: this.waveformcontainer.nativeElement,
      waveColor: 'red',
      progressColor: 'orange',
      cursorWidth: 1,
      cursorColor: 'black',
      backend: 'MediaElement',
      plugins: [
        // WaveSurferTimeline.default.create({
        //   container: '#timeline',
        //   height: 20,
        //   notchPercentHeight: 90,
        //   unlabeledNotchColor: '#c0c0c0',
        //   primaryColor: 'white',
        //   secondaryColor: 'gray',
        //   primaryFontColor: 'white',
        //   secondaryFontColor: 'white',
        //   zoomDebounce: 10,
        //   zoomThreshold: 10000,
        //   duration: this.duration,
        //   timeInterval: function (step: number) {
        //     let duration = moment.duration(step, 'seconds');
        //     if (duration.asHours() >= 1) {
        //       return duration.asSeconds();
        //     }
        //     return duration.asSeconds();
        //   },
        // }),
        WaveSurferRegion.default.create({
          regions: [],
        }),
        Minimap.default.create({}),
      ],
    });

    this.wave.load(this.audioFile);
    this.wave.on('ready', () => {
      // Create a region that spans the entire audio file
      const region = this.wave.addRegion({
        start: 0,
        end: 20,
        color: 'rgba(140, 191, 217, 0.4)',
        minLength: 20,
        maxLength: 20,
      });
    });
    this.cdr.detectChanges();
  }

  async uploadFiles(): Promise<void> {
    this.sending = true;
    console.log(this.musicForm.valid)
    if (this.musicForm.valid) {
      const loading = await this.presentLoading();
      const newFile = await this.exportSelected();
      const res = await this.tab3Service.uploadAudio(newFile, this.musicForm.value);
      if (res) {
        loading.dismiss();
      }
      this.name = '';
      this.presentToast();
      this.condition = false;
      this.sending = false;
    }
  }

  play(): void {
    this.wave.play();
  }

  pause(): void {
    this.wave.pause();
  }

  zoomIn() {
    this.wave.zoom(this.wave.params.minPxPerSec * 1.5);
  }

  zoomOut() {
    this.wave.zoom(this.wave.params.minPxPerSec * 0.5);
  }

  cancel() {
    this.condition = false;
  }
}
