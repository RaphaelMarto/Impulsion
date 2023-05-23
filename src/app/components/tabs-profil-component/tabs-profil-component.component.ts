import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TabsProfilService } from './service/tabs-profil.service';

@Component({
  selector: 'app-tabs-profil-component',
  templateUrl: './tabs-profil-component.component.html',
  styleUrls: ['./tabs-profil-component.component.scss'],
})
export class TabsProfilComponentComponent implements OnInit {
  activeTab: string = 'music';
  items: any[] = [];

  constructor(private tabsProfilService: TabsProfilService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.tabsProfilService.getAllMusicUser().subscribe((data: any) => {
      this.items = data;
    });
    this.cdr.detectChanges();
  }

  deleteMusic(item: any): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
    this.tabsProfilService.deleteMusic(index).subscribe();
  }

  deleteFriends(item: any): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}
