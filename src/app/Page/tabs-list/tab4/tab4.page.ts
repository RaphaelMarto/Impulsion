import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { config } from 'src/app/config/configuration';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSharingService } from 'src/app/service/data-sharing.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public isIOS: boolean;
  user: any = {
    nickname: '',
    avatar: '',
    email: '',
    phone: '',
    country: '',
    city: '',
  };
  public edit: boolean = false;
  profileForm!: FormGroup<any>;
  isSubmitted = false;
  userCopy: any;
  instrument:any;
  instruments: any[] = ['Baterrie', 'djambe', 'piano'];
  viewAddInstrument: boolean = false;
  options = { withCredentials: true };
  isDeployed:any;
  selectedInstruments:any;

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataSharingService: DataSharingService
  ) {
    this.isIOS = this.platform.is('ios');
  }

  ngOnInit(): void {
    this.getInfoUser();
    this.getInstrument();
  }

  getInfoUser(): void {
    this.http.get(config.API_URL + '/user', this.options).subscribe((s: any) => {
      this.userCopy = s;
      this.user.nickname = s.Nickname;
      this.user.avatar = config.API_URL + '/user/proxy-image?url=' + s.PhotoUrl;
      this.user.email = s.Email;
      this.instrument = s.Instrument;
      this.user.phone = s.Phone;
      this.user.country = s.Country;
      this.user.city = s.City;
      this.profileForm = this.formBuilder.group({
        nickname: [s.Nickname, Validators.required],
        email: [s.Email, [Validators.required, Validators.email]],
        phone: [s.Phone],
        country: [s.Country],
        city: [s.City],
        avatar: [config.API_URL + '/user/proxy-image?url=' + s.PhotoUrl],
      });
    });
  }

  getInstrument(){
    this.http.get(config.API_URL + "/music/instruments", this.options).subscribe((res:any)=>{
      this.instruments = res.instruments;
    })
  }

  emitEvent(show: boolean) {
    this.dataSharingService.setData(show);
  }

  Edit(): void {
    this.userCopy = { ...this.user };
    this.instruments  = this.instruments.filter(option => !this.instrument.includes(option));
    this.edit = true;
    this.emitEvent(false);
  }

  cancelEdit(): void {
    this.profileForm.setValue(this.userCopy);
    this.edit = false;
    this.emitEvent(true);
  }

  setDefaultImage() {
    var image = document.getElementById('myImage') as HTMLImageElement;
    image!.src = '../../../../assets/icon/user.png';
    image!.onerror = null;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.profileForm.valid) {
      this.user.nickname = this.profileForm.controls['nickname'].value;
      this.user.email = this.profileForm.controls['email'].value;
      this.user.phone = this.profileForm.controls['phone'].value;
      this.user.country = this.profileForm.controls['country'].value;
      this.user.city = this.profileForm.controls['city'].value;
      this.emitEvent(true);
      this.http.put(config.API_URL + '/user', this.user, this.options).subscribe();
      this.edit = false;
    }
  }

  addInstrument(value: any) {
    this.instrument.push(value);

    this.http.put(config.API_URL + '/user/instrument', {instrument:value}, this.options).subscribe();
  }

  delInstrument(index:number) {
    this.instrument.splice(index,1);

    this.http.delete(config.API_URL + '/user/instrument/'+index, this.options).subscribe();
  }

  Deconnexion() {
    this.router.navigate(['/login']);
  }

  Delete() {
    this.http.delete(config.API_URL + '/user', this.options).subscribe();
  }

  viewInstrument() {
    this.viewAddInstrument = true;
  }

  handleChange(event: any) {
    this.addInstrument(event.target.value);
    this.viewAddInstrument = false;
  }

  handleCancel() {
    this.viewAddInstrument = false;
  }
}
