import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TabsProfilService } from './service/tabs-profil.service';
import { Subscription, interval } from 'rxjs';
import { DataSharingService } from 'src/app/service/data-sharing.service';

@Component({
  selector: 'app-tabs-profil-component',
  templateUrl: './tabs-profil-component.component.html',
  styleUrls: ['./tabs-profil-component.component.scss'],
})
export class TabsProfilComponentComponent implements OnInit, OnDestroy {
  activeTab: string = 'music';
  music: any[] = [];
  follow: any[] = [];
  private subscription!: Subscription;
  destroy:boolean = false;
  
  constructor(private tabsProfilService: TabsProfilService, private cdr: ChangeDetectorRef,private dataSharingService:DataSharingService) {}

  ngOnInit() {
    this.dataSharingService.getDataTab().subscribe((data: boolean) => {
      this.destroy = data;

      if(this.destroy){
            this.stopRefresh()
          } else {
            this.refresh();
          }
    });
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.stopRefresh();
  }

  refresh() {
    this.subscription = interval(500).subscribe(() => {
      this.loadInitialData()
    });
  }

  stopRefresh() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadInitialData(): void {
    this.tabsProfilService.getAllMusicUser().subscribe((data: any) => {
      this.music = data;
    });

    this.tabsProfilService.getAllFollow().subscribe((data: any) => {
      this.follow = data;
    });
    this.cdr.detectChanges();
  }

  deleteMusic(item: any): void {
    const index = this.music.indexOf(item);
    if (index > -1) {
      this.tabsProfilService.deleteMusic(index).subscribe();
    }
  }

  deleteFollow(item: any): void {
    const index = this.follow.indexOf(item);
    if (index > -1) {
      this.tabsProfilService.deleteFollow(item.uid).subscribe();
    }
  }
}
