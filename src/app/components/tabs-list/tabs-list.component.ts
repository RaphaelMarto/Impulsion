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
  selectedTab: string = 'home';
  showTabBar: boolean = true;

  @ViewChild('tabs', { static: false }) tabs!: IonTabs;

  constructor(private dataSharingService: DataSharingService) {}

  ngOnInit() {
    this.dataSharingService.getData().subscribe((data: boolean) => {
      this.showTabBar = data;
    });
  }

  onTabSelected() {
    this.selectedTab = this.tabs.getSelected()!;
  }
}
