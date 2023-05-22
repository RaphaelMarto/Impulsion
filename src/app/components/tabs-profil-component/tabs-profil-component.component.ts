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
      console.log(this.items)
    });
    this.cdr.detectChanges();
  }

  deleteItem(item: any): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  loadMoreData(event: any): void {
    // const newItems = this.elementService.getMoreElements();

    this.items = this.items.concat(/*newItems*/ { numero: '5', nom: 'rfr' });

    event.target.complete();
  }

  loadMoreData2(event: any): void {
    // const newItems = this.elementService.getMoreElements();

    this.items = this.items.concat(/*newItems*/ { numero: '5', nom: 'rfr' });

    event.target.complete();
  }
}
