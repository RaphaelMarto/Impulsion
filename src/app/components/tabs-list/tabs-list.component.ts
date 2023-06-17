import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { DataSharingService } from 'src/app/service/data-sharing.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs-list.Component.html',
  styleUrls: ['tabs-list.Component.scss'],
})
export class TabsListComponent implements OnInit{
  selectedTab: any = 'home';
  showTabBar: boolean = true;

  @ViewChild('tabs', { static: false }) tabs!: IonTabs;
  lastActiveTabIndex!: any;

  constructor(private dataSharingService: DataSharingService) {}

  ngOnInit() {
    this.dataSharingService.getData().subscribe((data: boolean) => {
      this.showTabBar = data;
    });
  }

  onTabSelected() {
    this.selectedTab = this.tabs.getSelected()!;

    if (this.lastActiveTabIndex !== undefined && this.lastActiveTabIndex !== this.selectedTab && this.lastActiveTabIndex == "profil") {
      this.emitEvent(true)
    }

    this.lastActiveTabIndex = this.selectedTab;
    if(this.selectedTab == "profil"){
      this.emitEvent(false)
    }
  }

  emitEvent(show: boolean) {
    this.dataSharingService.setDataTab(show);
  }
}
