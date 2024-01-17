import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { config } from 'src/app/config/configuration';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { take } from 'rxjs';
import { InstrumentModalComponent } from 'src/app/components/instrument-modal/instrument-modal.component';

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
  instrumentShow:any[]=[];
  profileForm!: FormGroup<any>;
  isSubmitted = false;
  userCopy: any;
  instrument:any[]=[];
  instruments: any[] = [];
  instrumentsCopy: any[] = [];
  viewAddInstrument: boolean = false;
  options = { withCredentials: true };
  isDeployed:any;
  selectedInstruments:any;
  ApiUrl:string = config.API_URL;
  isModalOpen:boolean = false;

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataSharingService: DataSharingService,
    private modalController: ModalController,
    public alertController: AlertController
  ) {
    this.isIOS = this.platform.is('ios');
  }

  ngOnInit(): void {
    this.getInfoUser();
    this.getInstrument();
  }

  getInfoUser(): void {
    this.http.get(config.API_URL + '/user/info', this.options).pipe(take(1)).subscribe((s: any) => {
      this.user.nickname = s.UserInfo.Nickname;
      this.user.avatar = s.UserInfo.PictureUrl;
      this.user.email = s.UserInfo.Email;
      this.instrumentShow = s.InstrumentUser.map((instrument:any) => instrument.Name)
      this.instrument = s.InstrumentUser;
      this.user.phone = s.UserInfo.Phone;
      this.user.country = s.UserInfo.Address.City.Country.Name; // s.UserInfo.Address.City.Street s.UserInfo.Address.City.HouseNum s.UserInfo.Address.City.PostCode
      this.user.city = s.UserInfo.Address.City.Name;
      this.profileForm = this.formBuilder.group({
        nickname: [s.UserInfo.Nickname, Validators.required],
        email: [s.UserInfo.Email, [Validators.required, Validators.email]],
        phone: [s.UserInfo.Phone],
        country: [s.UserInfo.Address.City.Country.Name],
        city: [s.UserInfo.Address.City.Name],
        avatar: [s.UserInfo.PictureUrl],
      });
    });
  }

  getInstrument(){
    this.http.get(config.API_URL + "/user/instrument/all", this.options).pipe(take(1)).subscribe((res:any)=>{
      this.instruments = res;
      this.instrumentsCopy = res;
    })
  }

  emitEvent(show: boolean) {
    this.dataSharingService.setData(show);
  }

  Edit(): void {
    this.userCopy = { ...this.user };
    this.instruments  = this.instrumentsCopy.filter(option => !this.instrumentShow.includes(option.Name));
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
      this.user.city = 1;//this.profileForm.controls['city'].value;
      this.emitEvent(true);
      this.http.put(config.API_URL + '/user', this.user, this.options).pipe(take(1)).subscribe();
      this.edit = false;
    }
  }

  addInstrument(idInstrument: number) {
    const newInstrument = this.instrumentsCopy.find(item => item.id === idInstrument);
    if (newInstrument) {
      this.instrumentShow.push(newInstrument.Name);
      this.instrument.push(newInstrument);
    }

    this.http.get(config.API_URL + '/user/instrument/'+ idInstrument, this.options).pipe(take(1)).subscribe();
    this.instruments  = this.instrumentsCopy.filter(option => !this.instrumentShow.includes(option.Name));
  }

  delInstrument(idInstrument:number, NameInstru:string) {
    const indexInstrument = this.instrumentShow.indexOf(NameInstru);
    this.instrument = this.instrument.filter(item => item.id !== idInstrument);

    if (indexInstrument+1) {
      this.instrumentShow.splice(indexInstrument,1);
      this.http.delete(config.API_URL + '/user/instrument/'+idInstrument, this.options).pipe(take(1)).subscribe();
      this.instruments  = this.instrumentsCopy.filter(option => !this.instrumentShow.includes(option.Name));
    }
  }

  Deconnexion() {
    this.router.navigate(['/login']);
  }

  goAdmin(){
    this.router.navigate(['/admin']);
  }

  goStats(){
    this.router.navigate(['/statistics']);
  }

  Delete() {
    this.http.delete(config.API_URL + '/user', this.options).pipe(take(1)).subscribe();
  }

  async viewInstrument() {
    const modal = await this.modalController.create({
      component: InstrumentModalComponent,
      componentProps: {
        instrumentList: this.instruments,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.addInstrument(data);
    }
  }

  handleChange(event: any) {
    this.addInstrument(event.target.value);
    this.viewAddInstrument = false;
  }

  handleCancel() {
    this.viewAddInstrument = false;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async AccountDelete() {
    const alert = await this.alertController.create({
      header: 'Confirm deletion?',
      message: 'Are you sure you want to delete your account ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'medium',
        },
        {
          text: 'Delete',
          role: 'confirm',
          cssClass: 'alert-button-delete',
          handler: () => {
            this.Delete()
          },
        },
      ]
    });

    await alert.present();
  }
}
