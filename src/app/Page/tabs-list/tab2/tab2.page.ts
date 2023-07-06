import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  public buttonFocus: string = 'artiste';
  private options = { withCredentials: true };
  @ViewChild('searchBar') searchBar: any;

  constructor(private platform: Platform, private http: HttpClient, private router: Router) {
    this.isIOS = this.platform.is('ios');
  }

  async ngOnInit() {}

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    if (query !== '') {
      switch (this.buttonFocus) {
        case 'artiste':
          this.InputArtist(query);
          break;
        case 'musique':
          this.InputMusique(query);
          break;
        case 'instrument':
          this.InputInstrument(query);
          break;
      }
    } else {
      this.data = [];
    }
  }

  InputArtist(query: any) {
    this.http.get(config.API_URL + '/user/all/' + query, this.options).subscribe((res:any) => {
      this.data = res;
    });
  }

  InputMusique(query: any) {
    this.http.get(config.API_URL + '/music/all/' + query, this.options).subscribe((res:any) => {
      this.data = res;
    });
  }

  InputInstrument(query: any) {
    this.http.get(config.API_URL + '/music/instrument/all/' + query, this.options).subscribe((res:any) => {
      this.data = res;
    });
  }

  getProfile(id: string) {
    this.router.navigate(['/otherProfile', id]);
  }

  onButtonClick(name: string) {
    this.buttonFocus = name;
    this.searchBar.value = '';
    this.data = [];
  }
}
