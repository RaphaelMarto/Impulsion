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
  public music: any[] = [];
  public follow: any[] = [];
  unsub1: () => void = () => {};
  unsub2: () => void = () => {};
  private id: any;

  constructor(
    private tabsProfilService: TabsProfilService,
    private authService: AuthService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit() {
    this.loadInital();
    this.authService.getIdUser().subscribe((id:any) => {
      this.id = id.res;
      this.refresh();
      this.dataSharingService.getDataTab().subscribe((val)=>{
        if(val){
          this.destroy()
        } else{
          this.refresh();
        }
      })
    });
  }

  destroy() {
    this.stopRefresh();
  }

  refresh() {
    this.unsub1();
    this.unsub2();

    this.unsub1 = onSnapshot(doc(db, 'Music', this.id), (snapshot) => {
      this.loadInitialMusicData();
    });
    this.unsub2 = onSnapshot(doc(db, 'Follow', this.id), (snapshot) => {
      this.loadInitialFollowData();
    });
  }

  stopRefresh() {
    this.unsub1();
    this.unsub2();
  }

  loadInital(): void{
    this.tabsProfilService.getAllMusicUser().subscribe((musicData: any) => {
      this.music = musicData;
    });
    this.tabsProfilService.getAllFollow().subscribe((followData: any) => {
      this.follow = followData;
    });
  }

  loadInitialMusicData(): void {
    this.tabsProfilService.getAllMusicUser().subscribe((musicData: any) => {
      this.music = musicData;
      this.musicObserv = of(musicData);
    });
  }

  loadInitialFollowData(): void {
    this.tabsProfilService.getAllFollow().subscribe((data: any) => {
      this.follow = data;
      this.followObserv = of(data);
    });
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
