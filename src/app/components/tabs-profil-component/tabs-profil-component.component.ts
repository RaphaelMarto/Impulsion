import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TabsProfilService } from './service/tabs-profil.service';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'src/main';
import { AuthService } from 'src/app/Authentication/auth.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-tabs-profil-component',
  templateUrl: './tabs-profil-component.component.html',
  styleUrls: ['./tabs-profil-component.component.scss'],
})
export class TabsProfilComponentComponent implements OnInit {
  public activeTab: string = 'music';
  public musicObserv!: Observable<any[]>;
  public followObserv!: Observable<any[]>;

  constructor(private dataSharingService: DataSharingService,private tabsProfilService: TabsProfilService, private authService: AuthService) {}

  ngOnInit() {
    this.refresh();
    this.dataSharingService.getDataTab().subscribe((val) => {
      if (!val) {
        this.refresh();
      } 
    })
  }

  refresh() {
    this.loadInitialMusicData();
    this.loadInitialFollowData();
  }

  loadInitialMusicData(): void {
    this.tabsProfilService.getAllMusicUser().subscribe((musicData: any) => {
      this.musicObserv = of(musicData);
    });
  }

  loadInitialFollowData(): void {
    this.tabsProfilService.getAllFollow().subscribe((data: any) => {
      this.followObserv = of(data);
    });
  }

  deleteMusic(id: any): void {
    this.tabsProfilService.deleteMusic(id).subscribe(() => {
      this.loadInitialMusicData();
    });
  }

  deleteFollow(id: any): void {
    this.tabsProfilService.deleteFollow(id).subscribe(() => {
      this.loadInitialFollowData();
    });
  }
}
