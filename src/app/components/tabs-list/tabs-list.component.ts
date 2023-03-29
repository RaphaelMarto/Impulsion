import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs-list.Component.html',
  styleUrls: ['tabs-list.Component.scss'],
})
export class TabsListComponent {
  selectedTab:string ='home';
  constructor() {}
  @ViewChild('tabs', { static: false }) tabs!: IonTabs;

  onTabSelected() {
    this.selectedTab = this.tabs.getSelected()!;
  } 
}
