import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs';
import { config } from '../../config/configuration';
import { HttpClient } from '@angular/common/http';
import { Tab3Service } from 'src/app/Page/tabs-list/tab3/service/tab3.service';

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

  constructor(private modalCtrl: ModalController, private http: HttpClient,private tab3Service: Tab3Service) {}

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

  getType(){
    this.tab3Service.getGenre().subscribe((data) => {
      this.data = data;
      this.dataFiltered = data;
    });
  }
}
