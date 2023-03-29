import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, Platform } from '@ionic/angular';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  public isIOS: boolean;
  public like: boolean[] = [];
  public numLike: number[] = [0, 0];
  public images: string[] = [''];
  public page: number = 0;
  public scrollPositions: number[] = [];
  public currentPage: number = 0;

  @ViewChild('content', { static: true }) content!: IonContent;

  constructor(private platform: Platform) {
    this.isIOS = this.platform.is('ios');
  }

  ngOnInit() {
    this.images = [
      '../../../../assets/icon/test2.jpg',
      '../../../../assets/icon/test.png',
    ];
    this.init();
  }

  async init(){
    const firstpage = await this.content.getScrollElement();
    firstpage.scrollTo(0, 10);
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

  loadItems() {
    for (let i = 0; i < 3; i++) {
      this.images.push('../../../../assets/icon/example.jpg');
    }
  }

  loadData(ev: any) {
    setTimeout(() => {
      this.loadItems();
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

    //event.target.complete();
  }

  public isScrolling: boolean = true;
  public currentScrollPosition!: any;
  public lastScrollPosition: number = -1;

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
        const prevPageElement = document.querySelector(
          `#page-${this.page}`
        ) as HTMLElement;
        if (prevPageElement) {
          prevPageElement.scrollIntoView({
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
