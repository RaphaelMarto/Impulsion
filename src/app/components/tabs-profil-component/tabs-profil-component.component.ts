import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TabsProfilService } from './service/tabs-profil.service';

@Component({
  selector: 'app-tabs-profil-component',
  templateUrl: './tabs-profil-component.component.html',
  styleUrls: ['./tabs-profil-component.component.scss'],
})
export class TabsProfilComponentComponent implements OnInit {
  activeTab: string = 'music';
  music: any[] = [];
  follow: any[] = [];
  constructor(private tabsProfilService: TabsProfilService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadInitialData();
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
      this.music.splice(index, 1);
      this.tabsProfilService.deleteMusic(index).subscribe();
    }
  }

  deleteFollow(item: any): void {
    const index = this.follow.indexOf(item);
    if (index > -1) {
      this.follow.splice(index, 1);
      this.tabsProfilService.deleteFollow(item.uid).subscribe();
    }
  }
}
