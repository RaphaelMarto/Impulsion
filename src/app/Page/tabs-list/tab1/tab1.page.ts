import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { config } from 'src/app/config/configuration';
import { CommentModalComponent } from '../../../components/comment-modal/comment-modal.component';
import { AuthService } from 'src/app/Authentication/auth.service';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  public liked: boolean[] = [];
  public numLike: number[] = [];
  public numCom: number[] = [];
  public images: string[] = [''];
  public page: number = 0;
  public scrollPositions: number[] = [];
  public isScrolling: boolean = true;
  public currentScrollPosition!: any;
  public lastScrollPosition: number = -1;
  public musics: string[] = [];
  public audioMap = new Map();
  public observers: IntersectionObserver[] = [];
  public audioElements: any;
  public pausedAt: number = 0;
  private source: any;
  public MusicIds: any = [];
  public nickname: any = [];
  public titre: any = [];
  public login: boolean = false;
  public titleShown: any = [];
  private stopLoad: boolean = false;
  public musicsObserv!: Observable<any[]>;
  itemLikes: { [name: string]: boolean } = {};
  options = { withCredentials: true };

  @ViewChild('content', { static: true }) content!: IonContent;
  @ViewChildren('visual') visuals!: QueryList<any>;
  @ViewChild('swiper') swiperRef!: ElementRef;
  private context: AudioContext;

  constructor(
    private http: HttpClient,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router
  ) {
    this.context = new AudioContext();
  }

  async ngOnInit() {
    this.authService.isLoggedIn.subscribe(async (logedIn) => {
      this.login = logedIn;
      if (this.login) {
        this.authService.checkCondition().subscribe(async (condition) => {
          if (!condition) {
            this.router.navigate(['/condition']);
          }
        });
      }
      await this.getMusic();
      this.init();
    });
  }
  public condition0 = 0;
  public added = 0;

  setUpObservers() {
    // Stop all the sounds from the previous observer, if any
    if (this.audioElements) {
      this.audioElements.forEach((audio: any) => {
        audio.pause();
      });
    }

    // Disconnect and clear the previous observers
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers = [];

    const options = {
      rootMargin: '0px',
      threshold: 0.5,
    };

    this.added = 0;

    this.visuals.forEach((canva, index) => {
      const row = canva.nativeElement;
      let audio = this.audioMap.get(row); // Get existing audio element for the row, if any

      if (!audio) {
        // Create new audio element if none exists for the row
        audio = new Audio(this.musics[index]);
        audio.loop = true;
        audio.volume = 0.1;
        this.audioMap.set(row, audio); // Store the audio element in the map for future use
      }

      const startPlaying = () => {
        // Pause any other playing audio elements before starting this one
        this.audioMap.forEach((otherAudio) => {
          if (otherAudio !== audio && !otherAudio.paused) {
            otherAudio.pause();
          }
        });
        audio.play();
        this.visulize(canva, this.musics[index], false, true);
      };

      const stopPlaying = () => {
        audio.pause();
        this.visulize(canva, this.musics[index], false, false);
      };

      function togglePlaying() {
        if (audio.paused) {
          startPlaying();
        } else {
          stopPlaying();
        }
      }

      // row.removeEventListener('click', togglePlaying,true)
      if (this.condition0 == this.added) {
        row.addEventListener('click', togglePlaying, true);
        this.condition0++;
      }
      this.added++;

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start playing the audio when the row comes into view
            audio.play();
            this.visulize(canva, this.musics[index], true, true);
          } else {
            // Pause audio when row goes out of view
            audio.pause();
            this.visulize(canva, this.musics[index], true, false);
          }
        });
      }, options);

      this.observers.push(observer);
      observer.observe(row);
    });

    // Store the audio elements associated with this observer
    this.audioElements = Array.from(this.audioMap.values());
  }

  async getMusic() {
    setTimeout(() => {
      this.loadItems();
    }, 3000);
    this.swiperRef?.nativeElement.swiper.update();
  }

  init() {
    const container = document.querySelector('swiper-container');
    const observer = new MutationObserver(() => {
      this.setUpObservers();
    });

    observer.observe(container!, {
      childList: true,
      subtree: true,
    });
  }

  async loadAudio(url: string) {
    const encodedURLmusic = encodeURIComponent(url);
    const response = await fetch(config.API_URL + '/music/proxy-audio?url=' + encodedURLmusic);
    const arrayBuffer = await response.arrayBuffer();
    return this.context.decodeAudioData(arrayBuffer);
  }

  async visulize(canvas: ElementRef<HTMLCanvasElement>, URLmusic: string, playPause: boolean, loadUnload: boolean) {
    if (playPause) {
      if (loadUnload) {
        const audio = await this.loadAudio(URLmusic);
        const analyser = this.context.createAnalyser();
        analyser.fftSize = 2048;

        const gainNode = this.context.createGain();
        gainNode.gain.value = 0;

        this.source = this.context.createBufferSource();
        this.source.buffer = audio;
        this.source.loop = true;
        this.source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(this.context.destination);

        this.source.start(0);

        const bufferLength = analyser.frequencyBinCount;

        const dataArray = new Uint8Array(bufferLength);
        const canva = canvas.nativeElement;
        const canvasCtx = canva.getContext('2d');
        canva.width = window.innerWidth;
        canva.height = window.innerHeight;
        const WIDTH = canva.width;
        const HEIGHT = canva.height;

        function draw() {
          requestAnimationFrame(draw);

          analyser.getByteFrequencyData(dataArray);

          const gradientBg = canvasCtx!.createRadialGradient(
            WIDTH / 2,
            HEIGHT / 2,
            0,
            WIDTH / 2,
            HEIGHT / 2,
            HEIGHT / 2
          );
          gradientBg.addColorStop(0.2, 'rgba(0, 160, 226, 1)');
          gradientBg.addColorStop(1, 'rgba(16, 0, 255, 1)');
          canvasCtx!.fillStyle = gradientBg;
          canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

          const maxSegments = 70;
          const totalSpacing = 10; // Total spacing on both sides
          const availableWidth = WIDTH - totalSpacing; // Width minus the total spacing on both sides
          const barWidth = availableWidth / 70;
          const segmentWidth = barWidth * 2;
          const startX = totalSpacing; // Starting position with left spacing

          const gradientBar = canvasCtx!.createLinearGradient(0, HEIGHT, 0, 0);
          gradientBar.addColorStop(0, 'rgba(0, 0, 0, 1)');
          gradientBar.addColorStop(0.04, 'rgba(255, 0, 63, 1)');
          gradientBar.addColorStop(1, 'rgba(255, 0, 0, 1)');

          let x = startX;

          for (let i = 0; i < maxSegments; i++) {
            const start = Math.floor(i * (bufferLength / maxSegments));
            const end = Math.floor((i + 1) * (bufferLength / maxSegments));
            const segmentHeight = dataArray.slice(start, end).reduce((a, b) => a + b, 0) / (end - start);

            canvasCtx!.fillStyle = gradientBar;
            canvasCtx!.fillRect(x, HEIGHT / 1.7 - segmentHeight, barWidth, segmentHeight);

            x += segmentWidth;
          }
        }

        draw();
      } else if (this.source && !loadUnload) {
        this.source.stop();
      }
    } else {
      if (this.context.state === 'suspended' && this.source) {
        this.context.resume();
      } else if (this.context.state === 'running' && this.source) {
        this.context.suspend();
        this.pausedAt = this.context.currentTime;
      }
    }
  }

  async loadItems() {
    if (!this.stopLoad) {
      this.swiperRef?.nativeElement.swiper.update();
      this.http
        .get(config.API_URL + '/music/random/music?list=' + this.MusicIds)
        .pipe(take(1))
        .subscribe((res: any) => {
          if (res.length > 0) {
            this.musicsObserv = of(res);
            res.forEach((obj: any) => {
              this.musics.push(obj.FilePath);
              this.MusicIds.push(obj.id);
              this.getlike(obj.id);
              this.getComment(obj.id);
            });
          } else {
            this.stopLoad = true;
          }
        });
    }
  }

  loadData() {
    this.loadItems().then(() => {
      // After loading the new items, update the swiper
      this.updateSwiper();
    });
  }

  async updateSwiper() {
    const swiper = this.swiperRef?.nativeElement.swiper;

    await swiper.update();
  }

  deleteLike(idMusic: number) {
    this.itemLikes[idMusic] = false;
    this.numLike[idMusic]--;
    this.http
      .delete(config.API_URL + '/like/del/' + idMusic, this.options)
      .pipe(take(1))
      .subscribe();
  }

  like(idMusic: number) {
    this.itemLikes[idMusic] = true;
    this.numLike[idMusic]++;
    this.http
      .get(config.API_URL + '/like/add/' + idMusic, this.options)
      .pipe(take(1))
      .subscribe();
  }

  getlike(idMusic: number) {
    this.http
      .get(config.API_URL + '/like/liked/' + idMusic, this.options)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.numLike[idMusic] = res.numberOfLikes;
        this.itemLikes[idMusic] = res.isLiked;
      });
  }

  async openCommentModal(idMusic: string) {
    const modal = await this.modalController.create({
      component: CommentModalComponent,
      componentProps: {
        idMusic: idMusic,
      },
    });
    await modal.present();
  }

  getComment(idMusic: number) {
    this.http
      .get(config.API_URL + '/comment/comment/anon/' + idMusic)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.numCom[idMusic] = res.nbCom;
      });
  }
}
