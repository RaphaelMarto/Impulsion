import { Component, Input } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class HeaderComponent {
  @Input() name: string = '';
  public isIOS: boolean;

  constructor(private platform: Platform) {
    this.isIOS = this.platform.is('ios');
  }
}
