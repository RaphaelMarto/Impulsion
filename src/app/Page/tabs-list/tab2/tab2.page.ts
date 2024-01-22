import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, of, take } from 'rxjs';
import { AddressPopupComponent } from 'src/app/components/address-popup/address-popup.component';
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
  public selectedCity!: number;
  public CountryId!: number;
  locationForm!: FormGroup;
  @ViewChild('searchBar') searchBar: any;
  public url = config.API_URL + '/user/proxy-image?url=';

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder,private modalController: ModalController,) {
    this.locationForm = this.fb.group({
      country: [null, Validators.required],
      city: [{ value: null, disabled: true }, Validators.required],
    });
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

  InputArtist(query: string) {
    this.http
      .get(config.API_URL + '/user/all/' + query, this.options)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.dataObserv = of(res);
      });
  }

  InputMusique(query: string) {
    this.http
      .get(config.API_URL + '/music/all/' + query, this.options)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.dataObserv = of(res);
      });
  }

  InputInstrument(query: string) {
    this.http
      .get(config.API_URL + '/music/instrument/all/' + query, this.options)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.dataObserv = of(res);
      });
  }

  InputLocation() {
    if (this.locationForm.valid) {
      this.http
        .get(config.API_URL + '/user/location/' + this.selectedCity, this.options)
        .pipe(take(1))
        .subscribe((res: any) => {
          this.dataObserv = of(res);
        });
    }
  }

  async viewCountryOrCity(CountryOrCity:string, CountryId:number) {
    const modal = await this.modalController.create({
      component: AddressPopupComponent,
      componentProps: {
        CountryOrCity: CountryOrCity,
        CountryId: CountryId
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && CountryOrCity === "Country") {
      this.CountryId = data[0];
      this.locationForm.get('country')?.setValue(data[1])
      this.locationForm.get('city')?.setValue(null)
      this.locationForm.get('city')?.enable();
    } else if (role === 'confirm'){
      this.selectedCity = data[0];
      this.locationForm.get('city')?.setValue(data[1])
    }
  }

  getProfile(id: string) {
    this.router.navigate(['/otherProfile', id]);
  }

  onButtonClick(name: string) {
    this.buttonFocus = name;
    this.searchBar.value = '';
    this.dataObserv = of([]);
    if(name == 'Localiter'){
      this.locationForm.get('city')?.setValue(null);
      this.locationForm.get('country')?.setValue(null);
      this.locationForm.get('city')?.disable();
    }
  }
}
