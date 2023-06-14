import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { config } from 'src/app/config/configuration';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  public isIOS: boolean;
  public data: any;
  private options = { withCredentials: true };

  constructor(private platform: Platform, private http: HttpClient, private router: Router) {
    this.isIOS = this.platform.is('ios');
  }

  async ngOnInit() {}

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    if (query !== '') {
      this.http.get(config.API_URL + '/user/all/' + query, this.options).subscribe((res:any) => {
        this.data = res;
        // this.data.PhotoUrl = config.API_URL+'user/proxy-image?url=' + res.PhotoUrl;
      });
    } else{
      this.data = []
    }
  }

  getProfile(id: string) {
    this.router.navigate(['/otherProfile', id]);
  }
}
