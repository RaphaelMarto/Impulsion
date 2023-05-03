import { UserInterface } from './../../../interface/user.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../../Authentication/auth.service';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { config } from 'src/app/config/configuration';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public isIOS: boolean;
  public login: boolean = false;
  public nickname: string = '';
  public avatar: string = '';
  public email: string = '';

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.isIOS = this.platform.is('ios');
  }

  ngOnInit() {
    this.checkCookie();
    this.getInfoUser();
  }

  getInfoUser() {
    const options = { withCredentials: true };
    this.http.get(config.API_URL + '/user', options).subscribe((s: any) => {
      this.nickname = s[0].displayName;
      this.avatar = s[0].photoURL;
      this.email = s[0].email;
    });
  }

  checkCookie() {
    this.authService.checkCookie().subscribe((response) => {
      this.login = response;
    });
  }
}
