import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  liked: boolean = false;
  options = { withCredentials: true };
  idOther = this.route.snapshot.paramMap.get('id');
  music: any;
  followed: boolean = false;
  itemLikes: { [name: string]: boolean } = {};
  @ViewChild('audioPlayer', { static: false }) audioPlayerRef!: ElementRef<HTMLAudioElement>;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((logedIn) => {
      this.login = logedIn;
      this.getInfoUser();
      this.getAllMusicUser();
    });
  }

  async getInfoUser(): Promise<void> {
    this.http.get(config.API_URL + '/user/' + this.idOther).subscribe((s: any) => {
      this.user.nickname = s.Nickname;
      this.user.avatar = config.API_URL + '/user/proxy-image?url=' + s.PhotoUrl;
      this.user.country = s.Country;
    });
    if(this.login){
      this.http.get(config.API_URL + '/follow/' + this.idOther, this.options).subscribe((s: any) => {
        this.followed = s.res;
      });
    }
  }

  cancel() {
    this.location.back();
  }

  follow() {
    this.followed = true;
    this.http.post(config.API_URL + '/follow/' + this.idOther, {}, this.options).subscribe();
  }

  unfollow() {
    this.followed = false;
    this.http.delete(config.API_URL + '/follow/' + this.idOther, this.options).subscribe();
  }

  getAllMusicUser() {
    this.http.get(config.API_URL + '/music/' + this.idOther).subscribe((data: any) => {
      this.music = data;
      if(this.login){
        this.getlike();
      }
    });
  }

  deleteLike(name: string) {
    this.itemLikes[name] = false;
    this.http.put(config.API_URL + '/like/del/' + name, {}, this.options).subscribe();
  }

  like(name: string) {
    this.itemLikes[name] = true;
    this.http.put(config.API_URL + '/like/add/' + name, {}, this.options).subscribe();
  }

  getlike() {
    let music: any;
    for (music of this.music) {
      this.http
        .get(config.API_URL + '/like/liked/' + music.name, this.options)
        .subscribe((res: any) => {
          this.itemLikes[res.name] = res.res;
        });
    }
  }

  playAudio(url: string): void {
    const audioPlayer: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    audioPlayer.pause();

    audioPlayer.src = url;

    audioPlayer.play();
  }

  connexion(){
    this.router.navigate(['/login'])
  }
}
