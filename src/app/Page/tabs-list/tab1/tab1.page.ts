import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { InfiniteScrollCustomEvent, Platform } from '@ionic/angular';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, AfterViewInit {
  public isIOS: boolean;
  public like: boolean[] = [];
  public numLike: number[] = [0, 0];
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
  public clicked: boolean = false;
  private pausedAt: number = 0;
  private source: any;
  private lastObservedIndex: number = -1;

  @ViewChild('content', { static: true }) content!: IonContent;
  @ViewChild('hiddenButton') hiddenButton!: ElementRef;
  @ViewChildren('visual') visuals!: QueryList<ElementRef<HTMLCanvasElement>>;
  private context: AudioContext;

  constructor(private platform: Platform) {
    this.isIOS = this.platform.is('ios');
    this.context = new AudioContext();
  }

  ngOnInit() {
    // window.addEventListener('load', () => {
    //   console.log('click');
    //   document.body.dispatchEvent(new Event('click'))
    // });
    this.images = [
      '../../../../assets/icon/test.png',
      '../../../../assets/icon/test2.jpg',
      '../../../../assets/icon/test.png',
    ];
    this.musics = [
      '../../../../assets/10-0.mp3',
      '../../../../assets/10-1.mp3',
      '../../../../assets/10-2.mp3',
    ];
    this.init();
  }

  ngAfterViewInit() {
    this.hiddenButton.nativeElement.click();
  }

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

    this.visuals.forEach((canva, index) => {
      if (
        index === this.visuals.length - 1 &&
        index <= this.lastObservedIndex
      ) {
        return;
      }

      const row = canva.nativeElement;
      let audio = this.audioMap.get(row); // Get existing audio element for the row, if any

      if (!audio) {
        // Create new audio element if none exists for the row
        audio = new Audio(`../../../../assets/10-${index}.mp3`);
        audio.loop = true;
        audio.volume = 0.1;
        this.audioMap.set(row, audio); // Store the audio element in the map for future use
      }

      const startPlaying = () => {
        // Pause any other playing audio elements before starting this one
        if (this.clicked) {
          this.audioMap.forEach((otherAudio) => {
            if (otherAudio !== audio && !otherAudio.paused) {
              otherAudio.pause();
            }
          });

          audio.play();
          this.visulize(
            canva,
            `../../../../assets/10-${index}.mp3`,
            false,
            false
          );
        }
      };

      const stopPlaying = () => {
        audio.pause();
        this.visulize(
          canva,
          `../../../../assets/10-${index}.mp3`,
          false,
          false
        );
      };

      const togglePlaying = () => {
        if (audio.paused) {
          startPlaying();
        } else {
          stopPlaying();
        }
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
         // console.log(entry.isIntersecting);
          if (entry.isIntersecting) {
            // Start playing the audio when the row comes into view
            startPlaying();
            row.addEventListener('click', togglePlaying);
            this.visulize(
              canva,
              `../../../../assets/10-${index}.mp3`,
              true,
              true
            );
          } else {
            // Pause audio when row goes out of view
            stopPlaying();
            row.removeEventListener('click', togglePlaying);
            this.visulize(
              canva,
              `../../../../assets/10-${index}.mp3`,
              true,
              false
            );
          }
        });
      }, options);

      this.observers.push(observer);
      observer.observe(row);

      if (index === this.visuals.length - 1) {
        this.lastObservedIndex = index;
      }
    });

    // Store the audio elements associated with this observer
    this.audioElements = Array.from(this.audioMap.values());
    document.body.dispatchEvent(new Event('click'));
    this.clicked = true;
  }

  async init() {
    const firstpage = await this.content.getScrollElement();
    firstpage.scrollTo(0, 10);
    this.setUpObservers();
    const container = document.querySelector('ion-content');
    const observer = new MutationObserver(() => {
      this.setUpObservers();
    });

    observer.observe(container!, {
      childList: true,
      subtree: true,
    });
  }

  getLiked(PageNumber: number) {
    if (!this.like[PageNumber]) {
      this.like[PageNumber] = true;
      this.numLike[PageNumber] = 1;
    } else {
      this.getDisliked(PageNumber);
    }
  }

  getDisliked(PageNumber: number) {
    this.like[PageNumber] = false;
    this.numLike[PageNumber] = 0;
  }

  onHiddenButtonClick() {
    // window.addEventListener('load', () => {
    //   // Simulate a click event on the body element.
    //   console.log('ehehehhehe')
    //   document.body.dispatchEvent(new Event('click'));
    // });
    // // Listen for the click event on the body element.
    // document.body.addEventListener('click', () => {
    //   // Set the hasInteracted flag to true.
    //   this.clicked = true;
    // });
  }

  async loadAudio(url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return this.context.decodeAudioData(arrayBuffer);
  }

  async visulize(
    canvas: ElementRef<HTMLCanvasElement>,
    music: string,
    playPause: boolean,
    loadUnload: boolean
  ) {
    if (playPause) {
    //  console.log(this.context.state, this.source);
      if (loadUnload) {
 //       console.log('launch');
        const audio = await this.loadAudio(music);
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
  //      console.log(this.source, this.source.context.state);
        this.source.start(0);

        const bufferLength = analyser.frequencyBinCount;

        const dataArray = new Uint8Array(bufferLength);
        const canva = canvas.nativeElement;
        const canvasCtx = canva.getContext('2d');
        canva.width = window.innerWidth;
        canva.height = window.innerHeight;
        const WIDTH = canva.width;
        const HEIGHT = canva.height / 2 + 40;

        function draw() {
          requestAnimationFrame(draw);

          analyser.getByteFrequencyData(dataArray);

          const gradientBg = canvasCtx!.createRadialGradient(
            WIDTH / 2,
            HEIGHT - 40,
            0,
            WIDTH / 2,
            HEIGHT - 40,
            HEIGHT
          );
          gradientBg.addColorStop(0.2, ' rgba(0,160,226,1)');
          gradientBg.addColorStop(1, 'rgba(16,0,255,1)');
          canvasCtx!.fillStyle = gradientBg;
          canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT * 2);

          const maxSegments = 70;
          const barWidth = WIDTH / 70;
          const segmentWidth = barWidth * 2;
          let x = 2;

          const gradientBar = canvasCtx!.createLinearGradient(0, HEIGHT, 0, 0);
          gradientBar.addColorStop(0, ' rgba(0,0,0,1)');
          gradientBar.addColorStop(0.04, 'rgba(255,0,63,1)');
          gradientBar.addColorStop(1, 'rgba(255,0,0,1)');

          for (let i = 0; i < maxSegments; i++) {
            const start = Math.floor(i * (bufferLength / maxSegments));
            const end = Math.floor((i + 1) * (bufferLength / maxSegments));
            const segmentHeight =
              dataArray.slice(start, end).reduce((a, b) => a + b, 0) /
              (end - start);

            canvasCtx!.fillStyle = gradientBar;
            canvasCtx!.fillRect(
              x,
              HEIGHT - segmentHeight / 2,
              barWidth,
              segmentHeight / 2
            );

            x += segmentWidth;
          }
        }

        draw();
      } else if (this.source) {
      //  console.log('context', this.context.state, this.source.context.state);
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

  loadItems() {
    for (let i = 0; i < 3; i++) {
      this.images.push('../../../../assets/icon/example.jpg');
      this.musics.push('../../../../assets/10-' + (this.page + 1 + i) + '.mp3');
    }
  }

  loadData(ev: any) {
    setTimeout(() => {
      this.loadItems();
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

    //event.target.complete();
  }

  async onContentScroll(event: any) {
    const scrollPosition = event.detail.scrollTop;
    this.isScrolling = true;
    this.currentScrollPosition = scrollPosition;
  }

  async onContentScrollEnd(event: any) {
    if (
      this.isScrolling &&
      this.currentScrollPosition !== this.lastScrollPosition
    ) {
      const thresholdDown =
        this.page * window.innerHeight + window.innerHeight * 0.2;
      const thresholdUp =
        this.page * window.innerHeight - window.innerHeight * 0.15;

      if (this.currentScrollPosition > thresholdDown) {
        const nextPageElement = document.querySelector(
          `#page-${this.page + 1}`
        ) as HTMLElement;
        if (nextPageElement) {
          this.page = this.page + 1;
          nextPageElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }
      } else if (this.currentScrollPosition < thresholdUp) {
        const prevPageElement = document.querySelector(
          `#page-${this.page - 1}`
        ) as HTMLElement;
        if (prevPageElement) {
          this.page = this.page - 1;
          prevPageElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }
      } else {
        const currentPageElement = document.querySelector(
          `#page-${this.page}`
        ) as HTMLElement;
        if (currentPageElement) {
          currentPageElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }
      }
      this.lastScrollPosition = this.currentScrollPosition;
    }
    this.isScrolling = false;
  }
}
