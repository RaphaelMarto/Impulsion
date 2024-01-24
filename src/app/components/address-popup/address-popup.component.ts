import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map, take } from 'rxjs';
import { config } from '../../config/configuration';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-address-popup',
  templateUrl: './address-popup.component.html',
  styleUrls: ['./address-popup.component.scss'],
})
export class AddressPopupComponent implements OnInit {
  @Input() CountryOrCity!: any;
  @Input() CountryId!: any;
  public data: any;
  public dataFiltered: any;
  public name : string = ''
  public selectedata: any;
  private options = { withCredentials: true };

  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  ngOnInit() {
    if (this.CountryOrCity === 'Country') {
      this.getCountry();
    } else if(this.CountryOrCity === 'City') {
      this.getCity();
    } else {
      this.getType();
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss([this.selectedata,this.name], 'confirm');
  }

  onSearch(event: any) {
    this.dataFiltered = this.data.filter((obj: any) =>
      obj.Name.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }

  onRadioChange(instrumentId: any) {
    this.selectedata = instrumentId.target.value.id;
    this.name = instrumentId.target.value.Name;
  }

  getCountry() {
    this.http
      .get(config.API_URL + '/user/country/', this.options)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.data = res;
        this.dataFiltered = res;
      });
  }

  getCity() {
    this.http
      .get(config.API_URL + '/user/city/' + this.CountryId, this.options)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.data = res;
        this.dataFiltered = res;
      });
  }

  getGenre() {
    return this.http
      .get(config.API_URL + '/music/genre')
      .pipe(take(1))
      .pipe(
        map((response: any) => {
          return response.map((genre: any) => ({
            Name: genre.Name,
            id: genre.id,
          }));
        })
      );
  }

  getType(){
    this.getGenre().subscribe((data) => {
      this.data = data;
      this.dataFiltered = data;
    });
  }
}
