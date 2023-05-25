import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  public isIOS: boolean;
  public test: string = 'test';
  public test2: string = 'hein?';
  login:any

  constructor(
    private platform: Platform,
  ) {
    this.isIOS = this.platform.is('ios');
  }

  async ngOnInit() {
   
  }

}
