import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/Authentication/auth.service';
import { config } from 'src/app/config/configuration';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../main';
import { take } from 'rxjs';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent implements OnInit,OnDestroy {
  @Input() titre: string = '';
  public login: any;
  public UserComenting: string[] = [];
  public comments: any;
  public name: string = '';
  options = { withCredentials: true };
  private unsubscribe:any;

  constructor(private modalCtrl: ModalController, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(async (logedIn) => {
      this.login = logedIn;
      this.refresh();
      this.authService.getName().subscribe((res) => {
        this.name = res.Nickname;
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  async refresh() {
    this.unsubscribe = onSnapshot(doc(db, 'Comment', this.titre), (snapshot) => {
      this.getCom();
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  deleteCom(index: number) {
    this.http.delete(config.API_URL + '/comment/del/' + this.titre + '/' + index, this.options).pipe(take(1)).subscribe();
  }

  addComment(Ev: Event) {
    const inputElement = Ev.target as HTMLInputElement;
    let comment = inputElement.value;
    inputElement.value = '';
    this.http.put(config.API_URL + '/comment/add/' + this.titre, { comment: comment }, this.options).pipe(take(1)).subscribe();
  }

  getCom() {
    this.http.get(config.API_URL + '/comment/comment/' + this.titre, this.options).pipe(take(1)).subscribe((res: any) => {
      this.comments = res.comment;
      this.UserComenting = res.nameUserCom;
    });
  }
}
