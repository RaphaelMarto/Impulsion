import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page  implements OnInit {

  public isIOS: boolean;

  constructor(private platform: Platform) {
    this.isIOS = this.platform.is('ios');
  }
  ngOnInit() {}

}
