import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../../Authentication/auth.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { config } from 'src/app/config/configuration';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsListComponent } from 'src/app/components/tabs-list/tabs-list.component';
import { DataSharingService } from 'src/app/service/data-sharing.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public isIOS: boolean;
  public login: boolean = false;
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
  options = { withCredentials: true };

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataSharingService: DataSharingService
  ) {
    this.isIOS = this.platform.is('ios');
  }

  ngOnInit(): void {
    this.authService.checkCookie().subscribe(async (response) => {
      if (response) {
        await this.getInfoUser();
        this.login = response;
      }
    });
  }

  async getInfoUser(): Promise<void> {
    this.http
      .get(config.API_URL + '/user', this.options)
      .subscribe((s: any) => {
        this.userCopy = s;
        this.user.nickname = s.Nickname;
        this.user.avatar = s.PhotoUrl;
        this.user.email = s.Email;
        this.user.phone = s.Phone;
        this.user.country = s.Country;
        this.user.city = s.City;
        this.profileForm = this.formBuilder.group({
          nickname: [s.Nickname, Validators.required],
          email: [s.Email, [Validators.required, Validators.email]],
          phone: [s.Phone],
          country: [s.Country],
          city: [s.City],
          avatar: [s.PhotoUrl],
        });
      });
  }

  emitEvent(show:boolean) {
    this.dataSharingService.setData(show);
  }

  connexion(): void {
    this.router.navigate(['/login']);
  }

  Edit(): void {
    this.userCopy = { ...this.user };
    this.edit = true;
     this.emitEvent(false);
  }

  cancelEdit(): void {
    this.profileForm.setValue(this.userCopy);
    this.edit = false;
     this.emitEvent(true);
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
      this.http
        .put(config.API_URL + '/user', this.user, this.options)
        .subscribe();
      this.edit = false;
    }
  }
}
