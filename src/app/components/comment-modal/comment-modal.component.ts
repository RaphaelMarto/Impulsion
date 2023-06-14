import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/Authentication/auth.service';
import { config } from 'src/app/config/configuration';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent implements OnInit {
  @Input() titre: string = '';
  public login: any;
  public UserComenting: string[] = [];
  public comments: string[] = [];
  options = { withCredentials: true };

  constructor(private modalCtrl: ModalController, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(async (logedIn) => {
      this.login = logedIn;
      this.getCom();
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  deleteCom(index: number) {
    this.http.delete(config.API_URL + '/comment/del/' + this.titre + '/' + index, this.options).subscribe();
  }

  addComment(Ev: Event) {
    const inputElement = Ev.target as HTMLInputElement;
    const comment = inputElement.value;
    this.http.put(config.API_URL + '/comment/add/' + this.titre, { comment: comment }, this.options).subscribe();
  }

  getCom() {
    this.http.get(config.API_URL + '/comment/comment/' + this.titre, this.options).subscribe((res: any) => {
      this.comments = res.comment;
      this.UserComenting = res.nameUserCom;
    });
  }
}
