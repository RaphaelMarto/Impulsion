import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Authentication/auth.service';
import { config } from 'src/app/config/configuration';
import { Location } from '@angular/common';
import { take } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile-other-users',
  templateUrl: './profile-other-users.component.html',
  styleUrls: ['./profile-other-users.component.scss'],
})
export class ProfileOtherUsersComponent implements OnInit {
  user: any= {PictureUrl:'https://lh3.googleusercontent.com/a/AGNmyxbULLaSSq9aYWP1-JqEmoZ0bBc7-Gkw_SJJMQixsw=s96-c'};
  APIurl = config.API_URL;
  login: any;
  liked: boolean = false;
  options = { withCredentials: true };
  idOther = this.route.snapshot.paramMap.get('id');
  music: any;
  isMe:any;
  followed: boolean = false;
  itemLikes: { [name: number]: boolean } = {};
  titleShown: string[]=[];
  @ViewChild('audioPlayer', { static: false }) audioPlayerRef!: ElementRef<HTMLAudioElement>;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location, 
    public alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((logedIn) => {
      this.login = logedIn;
      this.getInfoUser();
      this.getAllMusicUser();
    });
  }

  async getInfoUser(): Promise<void> {
    this.http
      .get(config.API_URL + '/user/' + this.idOther)
      .pipe(take(1))
      .subscribe((s: any) => {
        this.user = s;
      });
    if(this.login){
      this.http
        .get(config.API_URL + '/follow/following/' + this.idOther, this.options)
        .pipe(take(1))
        .subscribe((s: any) => {
          this.followed = s.isFollowed;
          this.isMe = s.isMe;
        });
    }
  }

  cancel() {
    this.location.back();
  }

  follow() {
    this.followed = true;
    this.http
      .get(config.API_URL + '/follow/new/' + this.idOther, this.options)
      .pipe(take(1))
      .subscribe();
  }

  unfollow() {
    this.followed = false;
    this.http
      .delete(config.API_URL + '/follow/' + this.idOther, this.options)
      .pipe(take(1))
      .subscribe();
  }

  getAllMusicUser() {
    this.http
      .get(config.API_URL + '/music/' + this.idOther)
      .pipe(take(1))
      .subscribe((data: any) => {
        this.music = data;
        if (this.login) {
          this.getlike();
        }
      });
  }

  deleteLike(idMusic: number) {
    this.itemLikes[idMusic] = false;
    this.http
      .delete(config.API_URL + '/like/del/' + idMusic, this.options)
      .pipe(take(1))
      .subscribe();
  }

  like(idMusic: number) {
    this.itemLikes[idMusic] = true;
    this.http
      .get(config.API_URL + '/like/add/' + idMusic, this.options)
      .pipe(take(1))
      .subscribe();
  }

  getlike() {
    let music: any;
    for (music of this.music) {
      this.http
        .get(config.API_URL + '/like/liked/' + music.id, this.options)
        .pipe(take(1))
        .subscribe((res: any) => {
          this.itemLikes[music.id] = res.isLiked;
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

  async FollowDeleteConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm unfollow?',
      message: 'Are you sure you want to unfollow ?',
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
            this.unfollow()
          },
        },
      ]
    });

    await alert.present();
  }

  async LikeDeleteConfirm(id:number) {
    const alert = await this.alertController.create({
      header: 'Confirm?',
      message: 'Are you sure you want to unlike this music ?',
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
            this.deleteLike(id)
          },
        },
      ]
    });

    await alert.present();
  }

  openLink(link: string) {
    if (link) {
      window.open(link, '_system');
    }
  }
}
