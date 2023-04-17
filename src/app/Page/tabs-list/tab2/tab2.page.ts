import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../../../interface/user.interface';
import { Platform } from '@ionic/angular';
import { config } from '../../../config/configuration';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  public isIOS: boolean;
  public test: string = 'test';
  public test2: string = 'hein?';

  constructor(
    private platform: Platform,
    private http: HttpClient,
  ) {
    this.isIOS = this.platform.is('ios');
  }

  async ngOnInit() {
    this.http
      .get<UserInterface[]>(config.API_URL+'/users')
      .subscribe((res) => {
        this.test = res[0]['Username'];
      });
  }
}
