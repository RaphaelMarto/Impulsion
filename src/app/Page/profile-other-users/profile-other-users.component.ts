import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Authentication/auth.service';
import { config } from 'src/app/config/configuration';
import { Location } from '@angular/common';


@Component({
  selector: 'app-profile-other-users',
  templateUrl: './profile-other-users.component.html',
  styleUrls: ['./profile-other-users.component.scss'],
})
export class ProfileOtherUsersComponent implements OnInit {
  user: any = {
    nickname: '',
    avatar: '',
    country: '',
  };
  login: any;
  options = { withCredentials: true };
  idOther = this.route.snapshot.paramMap.get('id');
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.authService.checkCookie().subscribe((response) => this.authService.setLoggedInStatus(response));
    this.authService.isLoggedIn$.subscribe(async (logedIn) => {
      if (logedIn) {
        this.login = logedIn;
      }
    });
    this.getInfoUser();
  }

  setDefaultImage(): void {
    var image = document.getElementById('myImage') as HTMLImageElement;
    image!.src = '../../../../assets/icon/user.png';
    image!.onerror = null;
  }

  async getInfoUser(): Promise<void> {
    this.http.get(config.API_URL + '/user/' + this.idOther).subscribe((s: any) => {
      this.user.nickname = s.Nickname;
      this.user.avatar = s.PhotoUrl;
      this.user.country = s.Country;
    });
  }

  cancel() {
    this.location.back();
  }

  follow() {
    this.http.post(config.API_URL + '/follow/' + this.idOther, {}, this.options).subscribe();
  }
}
