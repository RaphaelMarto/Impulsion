import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { config } from 'src/app/config/configuration';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  public buttonFocus: string = 'artiste';
  private options = { withCredentials: true };
  public dataObserv!: Observable<any[]>;
  public instrument: string='';
  @ViewChild('searchBar') searchBar: any;

  constructor(private http: HttpClient, private router: Router) {
    
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
      this.dataObserv = of([]);
    }
  }

  InputArtist(query: any) {
    this.http.get(config.API_URL + '/user/all/' + query, this.options).pipe(take(1)).subscribe((res:any) => {
      this.dataObserv = of(res);
    });
  }

  InputMusique(query: any) {
    this.http.get(config.API_URL + '/music/all/' + query, this.options).pipe(take(1)).subscribe((res:any) => {
      console.log(res)
      this.dataObserv = of(res);
    });
  }

  InputInstrument(query: any) {
    this.http.get(config.API_URL + '/music/instrument/all/' + query, this.options).pipe(take(1)).subscribe((res:any) => {
      console.log(res)
      this.instrument = res.instrument;
      this.dataObserv = of(res.user);
    });
  }

  getProfile(id: string) {
    this.router.navigate(['/otherProfile', id]);
  }

  onButtonClick(name: string) {
    this.buttonFocus = name;
    this.searchBar.value = '';
    this.dataObserv = of([]);
  }
}
